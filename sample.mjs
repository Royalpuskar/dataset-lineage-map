export const sample={nodes:[
 {id:'survey',parents:[],recipe:'source: synthetic student survey v1',content:'respondent,hours\nA,4\nB,6\nC,8'},
 {id:'dictionary',parents:[],recipe:'source: data dictionary',content:'hours: weekly study hours; non-negative number'},
 {id:'cleaned',parents:['survey','dictionary'],recipe:'Drop rows with missing hours; retain non-negative values.',content:'respondent,hours\nA,4\nB,6\nC,8'},
 {id:'summary',parents:['cleaned'],recipe:'Compute arithmetic mean of hours.',content:'mean_hours\n6'},
 {id:'report',parents:['summary'],recipe:'Render the aggregate in a text report.',content:'The synthetic sample has a mean of 6 study hours.'},
 {id:'independent',parents:[],recipe:'Unrelated reference notes.',content:'This branch is independent of the survey.'}
]};
