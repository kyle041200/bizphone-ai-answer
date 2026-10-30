"""Loopback transport to ONLY our explicitly named internal Docker source server.
No internet destinations, proxy bypass for remote sites, or WordPress access.
"""
import subprocess,json,socket,socketserver,select,sys,ipaddress
name,port=sys.argv[1],int(sys.argv[2]);assert name in ['kghq-source-a','kghq-source-b']
data=json.loads(subprocess.check_output(['docker','inspect',name],text=True))[0]
network=data['NetworkSettings']['Networks']['kghq-source-only'];target=network['IPAddress'];assert ipaddress.ip_address(target).is_private
class Forward(socketserver.BaseRequestHandler):
 def handle(self):
  try:
   with socket.create_connection((target,5173),timeout=10)as upstream:
    streams=[self.request,upstream]
    while True:
     ready,_,_=select.select(streams,[],[],30)
     if not ready:return
     for incoming in ready:
      chunk=incoming.recv(65536)
      if not chunk:return
      (upstream if incoming is self.request else self.request).sendall(chunk)
  except (OSError,TimeoutError):return
class Server(socketserver.ThreadingTCPServer):allow_reuse_address=True;daemon_threads=True
print('Forwarding loopback source renderer '+name,flush=True)
with Server(('127.0.0.1',port),Forward)as server:server.serve_forever()
