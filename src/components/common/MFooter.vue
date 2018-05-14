<template>
  <div style="background: #0D88EB;width:100%">
    <div class="footer-container">
      <p>©{{new Date().getFullYear()}}亿宝贷All rights reserved|善林(上海)金融信息服务有限公司|沪ICP备14001535号-2</p>
      <div>
        <img src="~assets/img/chengxin.jpg" alt="">
        <img src="~assets/img/credit.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="less" scoped>
  .footer-container{
    width: 1200px;
    margin: 0 auto;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    & > div {
      display: flex;
      align-items: center;
      img{
        width: auto;
        height: 38px;
        margin: 0 10px;
      }
    }
  }
</style>
