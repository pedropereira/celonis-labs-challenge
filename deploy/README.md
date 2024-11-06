# Deployment

The application is currently deployed manually via SSH on our EC2 instance.

```
scp -i ./id_rsa_prod_server.pub . root@dedicated-server.example.com
ssh  -i ./id_rsa_prod_server.pub root@dedicated-server.example.com
```
