<template>
  <!--账户总览-->
  <div>
    <Row>
      <Col span="3">
        <img src="~/assets/img/userIcon.jpg" alt="">
      </Col>
      <Col span="21">
        <span>{{ phone | phoneHidden }}</span>
        <p>
        	{{ newTimer }}，{{ status < 0 ? '您提交企业资料未审核通过，请重新提交！': (status <= 1 ?  titleInfo[status] : userInfo.name)}}
        	<router-link to="/enterpriseAuth/applyForLoan" v-if="status == 4">去借款</router-link>
        	<router-link to="/enterpriseAuth" v-if="status <= 0 ">去提交</router-link>
        	<router-link to="/enterpriseAuth" v-if="status == 1">重新提交</router-link>
        	<router-link to="/enterpriseAuth" v-if="status == 2">去存管实名</router-link>
        	<router-link to="/enterpriseAuth/openAccount" v-if="status == 3">
          {{ !bankCard ? '去存管绑卡' : '存管绑卡审核中'}}</router-link>
        	<!-- <a href="javascript:;" v-if="bankCard">存管绑卡审核中</a> -->
        </p>
      </Col>
    </Row>
  </div>
</template>

<script>
    export default {
        props:["status"],
        data(){
            return {
            	userInfo:{},
            	newTimer:"",
              bankCard:false,
              titleInfo:['您还未提交企业资料','您已提交企业资料，审核中']
            }
        },
        computed:{
          phone(){
            return sessionStorage.getItem('phone_num')
          }
        },
        created(){
        	this.getUserInfo(),
          this.getNewTime()
        },
        methods:{
        	getUserInfo(){
        		this.$mine("borrowMoney/selectAllEnterpriseInfo").then(res=>{
        			this.userInfo = res.model;
        		}).catch(res=>{
        			console.log(res);
        		});
        	},
        	getNewTime(){
        		let times = new Date();
        		let hours = times.getHours();
        		if(hours >= 6 && hours <= 12){
        			this.newTimer = "上午好";
        		}else if(hours > 12 && hours <= 18){
        			this.newTimer = "下午好";
        		}else{
        			this.newTimer = "晚上好";
        		}
        	}
        }
    }
</script>

<style scoped>
  .ivu-row{height:150px;background:#fff;}
  .ivu-row img{width:80px;vertical-align: middle;}
  .ivu-col{padding-top:35px;}
  .ivu-col:nth-child(1){text-align:center;}
  .ivu-col:nth-child(2){color:#333;}
  .ivu-col:nth-child(2) span{display:inline-block;font-size: 18px;padding:15px 0 6px;}
  .ivu-col a{color:#0D88EB;margin-left:30px;}
</style>
