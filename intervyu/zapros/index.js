api.post('dwedwe/dwefw/wdef', {data}).then( (response) => {
  console.log(response)
} )

api.post('dwed/dwefwe', {
  refresh_token: refreshToken,
}).then( (res) => {
  console.log(res)
} )

api.post('ferfe/rferferf', {id:data.id}).then( (res) => {
  console.log(res)
} )

await this.api.post('fb-businesses/submit_verify_url', {
  data: [
    {
      bm_id: bm.id,
      link: this.links[bm.id]
    }
  ]
});