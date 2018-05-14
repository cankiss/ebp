<template>
  <div>
    <div class="validate-header">
      <div class="validate-info">
        <img src="~assets/img/icon_bigwarning.png" alt="">
        <span>{{status < 0 ? '您提交企业资料未审核通过，请重新提交！' : showInfoArr[status]}}</span>
      </div>
      <div class="validate-arrows-wrapper">
        <div class="validate-arrows">
          <p>1.填写企业资料</p>
        </div>
        <div class="validate-arrows" :class="status > 1 ? 'triangle' : 'triangle-gray' ">
          <p>2.后台资料审核 </p>
        </div>
        <div class="validate-arrows" :class="status > 2 ? 'triangle' : 'triangle-gray'">
          <p>3.存管绑卡开户</p>
        </div>
        <div class="validate-arrows" :class="status > 3 ? 'triangle' : 'triangle-gray'">
          <p>4.提交借款申请</p>
        </div>
        <div class="validate-arrows" :class="isChecked ? 'triangle' : 'triangle-gray'">
          <p>5.审核借款</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props:['status'],
  data(){
    return {
      showInfoArr:['您尚未提交资料审核！',
      '您提交企业资料，正在审核！',
      '您已审核通过，请提交存管实名！',
      '您已实名，请前去绑卡',
      '存管绑卡成功，开始借款！']
    }
  },
  computed:{
    ...mapState({
      isChecked : state => state.loanChecked.isChecked
    })
  }
}
</script>
<style lang="less" scoped>
  .validate-header{
    width: 100%;
    height: 50px;
    padding: 10px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    box-shadow: 0 4px 6px 0 rgba(220,227,248,0.50);
    margin: 20px 0;
    .validate-info{
      img{
        width: auto;
        height: 20px;
        float: left;
        margin-right: 10px;
      }
      span{
        float: left;
      }
    }
    .validate-arrows-wrapper{
      display: flex;
      align-items: center;
      color: #fff;
      .validate-arrows{
        background: url('~assets/img/icon_bigarrow_03.png') no-repeat;
        background-size: cover;
        height: 30px;
        width: 137px;
        margin: 0 3px;
        p{
          line-height: 30px;
          text-align: center;
        }
      }
      .triangle{
        background: url('~assets/img/icon_bigarrow_01.png.jpg') no-repeat;
        background-size: cover;
      }
      .triangle-gray{
        background: url('~assets/img/icon_bigarrow_02.png.png') no-repeat;
        background-size: cover;
        color: #666;
      }
    }
  }
</style>
