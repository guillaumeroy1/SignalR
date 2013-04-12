using System;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR.Tracing;

namespace Microsoft.AspNet.SignalR.Hosting.AspNet.Samples.Hubs.Test
{
    public class TestHub : Hub
    {
        private static ConcurrentDictionary<string, string> _connections = new ConcurrentDictionary<string, string>();
        private static ConcurrentDictionary<string, string> _groups = new ConcurrentDictionary<string, string>();
        private static readonly TraceSource _trace;

        static TestHub()
        {
            _trace = GlobalHost.DependencyResolver.Resolve<ITraceManager>()["SignalR.ScaleoutMessageBus"];
        }

        public override Task OnConnected()
        {
            _trace.TraceVerbose(typeof(TestHub).Name + ".OnConnected");
            _connections.TryAdd(Context.ConnectionId, string.Empty);
            Clients.All.clientConnected(new NodeEvent(Context.ConnectionId));
            return Clients.Caller.groupsAll(new NodeEvent(_groups.Keys));
        }

        public override Task OnDisconnected()
        {
            _trace.TraceVerbose(typeof(TestHub).Name + ".OnDisconnected");
            string value;
            _connections.TryRemove(Context.ConnectionId, out value);
            return Clients.All.clientDisconnected(new NodeEvent(Context.ConnectionId));
        }

        public override Task OnReconnected()
        {
            _trace.TraceVerbose(typeof(TestHub).Name + ".OnReconnected");
            return Clients.All.clientReconnected(new NodeEvent(Context.ConnectionId));
        }

        public void SendToAll(string message)
        {
            string data = string.Format("[{0}] {1}", Context.ConnectionId, message);
            Clients.All.received(new NodeEvent(data));
        }

        public void SendToCaller(string message)
        {
            string data = string.Format("[{0}] {1}", Context.ConnectionId, message);
            Clients.Caller.received(new NodeEvent(data));
        }

        public void SendToClient(string targetConnectionId, string message)
        {
            string data = string.Format("[{0}] {1}", Context.ConnectionId, message);
            Clients.Client(targetConnectionId).received(new NodeEvent(data));
        }

        public void SendToGroup(string groupName, string message)
        {
            string data = string.Format("[{0}, {1}] {2}", Context.ConnectionId, groupName, message);
            Clients.Group(groupName).received(new NodeEvent(data));
        }

        public void JoinGroup(string groupName, string connectionId = "")
        {
            if (string.IsNullOrEmpty(connectionId))
            {
                connectionId = Context.ConnectionId;
            }

            if (string.IsNullOrEmpty(groupName))
            {
                throw new ArgumentNullException("groupName");
            }

            if (!_groups.ContainsKey(groupName))
            {
                _groups.TryAdd(groupName, string.Empty);
                Clients.All.addedGroup(new NodeEvent(groupName));
            }

            Groups.Add(connectionId, groupName);
            Clients.Client(connectionId).joinedGroup(new NodeEvent(groupName));
        }

        public void UnjoinGroup(string groupName, string connectionId = "")
        {
            if (string.IsNullOrEmpty(connectionId))
            {
                connectionId = Context.ConnectionId;
            }

            if (string.IsNullOrEmpty(groupName))
            {
                throw new ArgumentNullException("groupName");
            }

            Groups.Remove(connectionId, groupName);
            Clients.Client(connectionId).unjoinedGroup(new NodeEvent(groupName));
        }
    }
}