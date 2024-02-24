function reverseString(str) {return str.split('').reverse().join('');}

function aws_config(){
    AWS.config.update(
        {
            region: "us-east-1",/*endpoint: "http://localhost:8000",*/
            accessKeyId: reverseString("7WOI5C5LZCTCLAVVAIKA"),
            secretAccessKey: reverseString("Uu6UFNripU1JUZFQ4sNxi2IB+CNXu+JG2crz1Fx0")
        });
}

function login(Userdata){
  aws_config()
  var dynamodb = new AWS.DynamoDB();
  var params = {
    Key: {
     "email": {
       S: Userdata["username"]
      }
    }, 
    TableName: "booktyping-pro-users"
   };
   dynamodb.getItem(params, function(err, data) {
      if (err){
          console.log(err, err.stack);
      }else{
          if(Object.keys(data).length != 0){
            const userData = {
              "name": data["Item"]["fullname"]["S"],
              "email": data["Item"]["email"]["S"],
              "totalPages": data["Item"]["pagesCount"]["S"],
              "pagesCompleted": data["Item"]["pagesCompleted"]["S"],
              "startDate": data["Item"]["startDate"]["S"],
              "lastDate": data["Item"]["lastDate"]["S"]
          }

          console.log(data)

            if(Userdata["password"] ==  data["Item"]["password"]["S"]){
              sessionStorage.setItem("userData", btoa(JSON.stringify(userData)))
              location = "dashboard.html";
            }else{
              document.getElementById("test").innerHTML = "Incorrect Password";
            }
          }else{
            document.getElementById("test").innerHTML = "User Not Found";
          }
      }
   });
}


function register(data){
    aws_config()
    var dynamodb = new AWS.DynamoDB();
    var params = {
        Item: {
          "email": {
           S: data["email"]
          },
          "fullname": {
           S: data["fullname"]
          },
          "pagesCount": {
            S: data["pagesCount"]
           },
          "pagesCompleted": {
            S: "0"
           },
          "startDate": {
            S: data["startDate"]
           },
          "lastDate": {
            S: data["lastDate"]
          },
          "password": {
            S: data["password"]
          }
        }, 
        ReturnConsumedCapacity: "TOTAL",
        TableName: "booktyping-pro-users"
       };
       dynamodb.putItem(params, function(err, data) {
         if (err){
            console.log(err, err.stack);
         }else{
            alert("User Registered Successfully");
         }
       });
}

function employee_list(){
  aws_config()
  var dynamodb = new AWS.DynamoDB();
  var params = {
    TableName: "booktyping-pro-users"
   };
   dynamodb.scan(params, function(err, data) {
    if (err){
        console.log(err, err.stack);
    }else{
        show(data)
    }
   });
}

function getUserData(username){
  aws_config()
  var dynamodb = new AWS.DynamoDB();
  var params = {
    Key: {
     "email": {
       S: username
      }
    }, 
    TableName: "booktyping-pro-users"
   };
   dynamodb.getItem(params, function(err, data) {
      if (err){
          console.log(err, err.stack);
      }else{
          if(Object.keys(data).length != 0){
            const userData = {
              "name": data["Item"]["fullname"]["S"],
              "email": data["Item"]["email"]["S"],
              "totalPages": data["Item"]["pagesCount"]["S"],
              "pagesCompleted": data["Item"]["pagesCompleted"]["S"],
              "startDate": data["Item"]["startDate"]["S"],
              "lastDate": data["Item"]["lastDate"]["S"]
          }
          sessionStorage.setItem("userData", btoa(JSON.stringify(userData)));
          location = "result.html";
        }
      }
   });
}

function getUserDashboard(username){
  aws_config()
  var dynamodb = new AWS.DynamoDB();
  var params = {
    Key: {
     "email": {
       S: username
      }
    }, 
    TableName: "booktyping-pro-users"
   };
   dynamodb.getItem(params, function(err, data) {
      if (err){
          console.log(err, err.stack);
      }else{
          if(Object.keys(data).length != 0){
            const userData = {
              "name": data["Item"]["fullname"]["S"],
              "email": data["Item"]["email"]["S"],
              "totalPages": data["Item"]["pagesCount"]["S"],
              "pagesCompleted": data["Item"]["pagesCompleted"]["S"],
              "startDate": data["Item"]["startDate"]["S"],
              "lastDate": data["Item"]["lastDate"]["S"]
          }
          sessionStorage.setItem("userData", btoa(JSON.stringify(userData)));
          location = "dashboard.html";
        }
      }
   });
}

function PutPages(fields){
  aws_config()
  var s3 = new AWS.S3();
  document.getElementById("pageBody").innerHTML = "Submitting";
  var params = {
    Body: JSON.stringify(fields),
    Bucket: "booktypingpro-data",
    Key: `${fields["email"]}/page${fields["pageNumber"]}`
   };
   s3.putObject(params, function(err, data) {
     if(err){
      console.log(err, err.stack); // an error occurred
     }else{
      //console.log(data);           // successful response
      var dynamodb = new AWS.DynamoDB();
      var params = {
        Key: {
         "email": {
           S: fields["email"]
          }
        }, 
        TableName: "booktyping-pro-users"
       };
       dynamodb.getItem(params, function(err, data) {
          if (err){
              console.log(err, err.stack);
          }else{
              if(Object.keys(data).length != 0){
              const userData = {
                  "name": data["Item"]["fullname"]["S"],
                  "email": data["Item"]["email"]["S"],
                  "totalPages": data["Item"]["pagesCount"]["S"],
                  "pagesCompleted": fields["pageNumber"],
                  "startDate": data["Item"]["startDate"]["S"],
                  "lastDate": data["Item"]["lastDate"]["S"]
              }

              var params = {
                Item: {
                  "email": {
                   S: data["Item"]["email"]["S"]
                  },
                  "fullname": {
                   S: data["Item"]["fullname"]["S"]
                  },
                  "pagesCount": {
                    S: data["Item"]["pagesCount"]["S"]
                   },
                  "pagesCompleted": {
                    S: fields["pageNumber"]
                   },
                  "startDate": {
                    S: data["Item"]["startDate"]["S"]
                   },
                  "lastDate": {
                    S: data["Item"]["lastDate"]["S"]
                  },
                  "password": {
                    S: data["Item"]["password"]["S"]
                  }
                }, 
                ReturnConsumedCapacity: "TOTAL",
                TableName: "booktyping-pro-users"
               };
               dynamodb.putItem(params, function(err, data) {
                 if (err){
                    console.log(err, err.stack);
                 }else{
                    sessionStorage.setItem("userData", btoa(JSON.stringify(userData)))
                    alert("Your Page " + fields["pageNumber"] + " Submitted Successfully");
                    location = "dashboard.html";
                 }
               });
              }else{
                document.getElementById("test").innerHTML = "User Not Found";
              }
          }
       }); 
     }     
   });
}


function getPages(){
  aws_config()
  var s3 = new AWS.S3();
  var params = {
    Bucket: "booktypingpro-data"
   };
   s3.listObjects(params, function(err, data) {
     if(err){
      console.log(err, err.stack); // an error occurred
     }else{
      for(var i=0;i<data["Contents"].length;i++){
        if(data["Contents"][i]["Key"].split("/")[0] == userData["email"]){
          var params = {
            Bucket: "booktypingpro-data",
            Key: data["Contents"][i]["Key"]
           };
           s3.getObject(params, function(err, data) {
             if (err){
              console.log(err, err.stack); // an error occurred
             }else{
              var data = data.Body.toString('utf-8')
              display(JSON.parse(data))
             }
           });
        }
      }
     }     
   });
}

function getPage(){
  aws_config()
  var s3 = new AWS.S3();
  const queryParams = new URLSearchParams(window.location.search);
  const param1Value = queryParams.get('page');
  var params = {
    Bucket: "booktypingpro-data",
    Key: userData["email"]+"/page"+param1Value
   };
   s3.getObject(params, function(err, data) {
     if (err){
      console.log(err, err.stack); // an error occurred
     }else{
      var data = data.Body.toString('utf-8')
      fieldDetails(JSON.parse(data))
     }
   });
}