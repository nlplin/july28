<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  // async mounted(){
  //   const result = await this.$API.trademark.getTrademarkList(1,5)
  //   // console.log(this.$API)
  //   console.log(result)
  // }
  async mounted(){
    const res1 = await this.$API.spu.getSpuProduct(1,5,61)
    const res2 = await this.$API.sku.getSkuList(1,5)
    console.log('11',res1)
    console.log('22',res2)

  }
}
</script>
