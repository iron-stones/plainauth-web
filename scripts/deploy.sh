echo -e "---------docker Login--------"
docker login --username=$1  --password=$2 

echo -e "---------docker Stop--------"
docker stop <你镜像的别名(在下面 会生成)>  # 注意修改

echo -e "---------docker Rm--------"
docker rm <你容器名字> 									 # 注意修改
docker rmi <你镜像的名字>									# 注意修改

echo -e "---------docker Pull--------"
docker pull <docker服务器上镜像的名字>:<镜像的tag默认是github分支的名字>  		 # 注意修改

echo -e "---------docker Create and Start--------"
docker run --rm -d -p 80:80 --name <容器的名字> <docker服务器上镜像的名字>:<镜像的tag默认是github分支的名字> # 注意修改

echo -e "---------deploy Success--------"