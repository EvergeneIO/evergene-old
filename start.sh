cd /opt/containers/evergene;

#npm run system-stop
docker stop c0408f1e91938160234728b7ebe1f656d9083b99348c396227613e7af791569d
#npm run system-stopped

#npm run bot-stop
docker stop 97047f96f812c216fcde4fe68688486735d005fe44f4985791f895009f568235
#npm run bot-stopped

rm .env;
git pull origin live;
cp /opt/env/.env.evergene .env;
npm install

docker start c0408f1e91938160234728b7ebe1f656d9083b99348c396227613e7af791569d
docker start 97047f96f812c216fcde4fe68688486735d005fe44f4985791f895009f568235

