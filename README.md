# SurveyServer

#DB \
BUILD: sudo docker build -t my_mongo_image . \
RUN: sudo docker run -p 6000:27017 -it --name my_mongo_container -d my_mongo_image 

#BE \
npm i \
npm run build \
npm run start 

#FE \
npm i \
ng serve 
