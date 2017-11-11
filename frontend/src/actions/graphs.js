import axios from 'axios';

export const asyncGetGraphs = () => dispatch => {
    //get array with urls
    axios.get("https://pds17zebrd.execute-api.us-west-2.amazonaws.com/dev/correlations").then((response) => {

      //added another test
      // response.data.push('https://s3-us-west-2.amazonaws.com/iotchallenge/twitter_trends_temp.json');

      if(response.data && response.data.length){
        let promiseArray = response.data.map(url => axios.get(url));

        //get data from all urls
        axios.all(promiseArray)
          .then(function(results) {
            let output = [];
            for (let result in results){
              console.log(results[result].data);
              let first_data_name = Object.keys(results[result].data.descriptions)[0];
              let second_data_name = Object.keys(results[result].data.descriptions)[1];
              let first_data_description = results[result].data.descriptions[first_data_name];
              let second_data_description = results[result].data.descriptions[second_data_name];
              let first_data = [];
              let second_data = [];
              results[result].data[first_data_name].map((el) => {
                  let date = new Date(Number(el.time_added.N));
                  let element = {
                      name: date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes()
                  };
                  element[first_data_description] = Number(el.value.N);
                  first_data.push(element);
                });
              results[result].data[second_data_name].map((el) => {
                  let date = new Date(Number(el.time_added.N));
                  let element = {
                      name: date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes()
                  };
                  element[second_data_description] = Number(el.value.S);
                  second_data.push(element);
                });
                output.push({
                  descriptions: [
                    first_data_description,
                    second_data_description
                  ],
                  data: [first_data, second_data],
                  correlation: results[result].data.correlation,
                  corr: true
                })

            }
                console.log("result", output);

              dispatch({ "type": "FETCH_GRAPHS_SUCCESS", payload: output });
              dispatch({ "type": "LOADING_STATE", payload: false });

          }).catch((error) => {
            console.log("axios error", error);
            dispatch({ "type": "LOADING_STATE", payload: false });
          });
      }
    }).catch((error) => {
      console.log("error", error);
      dispatch({ "type": "LOADING_STATE", payload: false });
    })
}
