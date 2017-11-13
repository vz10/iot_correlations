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
              let first_data_name = Object.keys(results[result].data.descriptions)[0];
              let second_data_name = Object.keys(results[result].data.descriptions)[1];
              let first_data_description = results[result].data.descriptions[first_data_name];
              let second_data_description = results[result].data.descriptions[second_data_name];
              let input_data = [];
              for (let i=0; i < results[result].data.data.name.length; i++){
                let date = new Date(Number(results[result].data.data.name[i]));
                let element = {
                    name: date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes()
                };
                element[first_data_description] = Number(results[result].data.data[first_data_description][i]);
                element[second_data_description] = Number(results[result].data.data[second_data_description][i]);
                input_data.push(element);
              };
              output.push({
                descriptions: [
                  first_data_description,
                  second_data_description
                ],
                data: input_data,
                correlation: results[result].data.correlation,
                corr: true
              })

            }
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
