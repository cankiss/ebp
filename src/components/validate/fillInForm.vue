<template>
  <div class="enterprise-info-wrap">
    <div v-if="(status >= 1 && status <= 3) || status < 0 ">
      <div class="user-status">
        <div>
          <Button type="primary" @click.native="submit('formItem')" :loading="isLoading">
            {{status < 0 ? "重新提交" : buttonInfo}}</Button>
        </div>
      </div>
    </div>
    <div class="enterprise-info">
      <img src="~assets/img/icon_com.png" alt="">
      <p>企业基本资料</p>
    </div>
    <div class="enterprise-base-info-wrapper">
      <Form :model="formItem" ref="formItem" :rules="formValidate" :label-width="160" label-position="left">
        <div class="enterprise-base-info">
          <Form-item label="公司名称：" prop="name">
            <Input v-model="formItem.name" size="large" placeholder="请输入" :maxlength="20" :readonly="status > 1"></Input>
          </Form-item>
          <Form-item label="营业执照号：" prop="permitNo">
            <Input v-model="formItem.permitNo" size="large" placeholder="请输入" :maxlength="20" :readonly="status > 1"></Input>
          </Form-item>
          <Form-item label="组织机构代码证：" prop="orgNo">
            <Input v-model="formItem.orgNo" size="large" placeholder="请输入" :maxlength="20" :readonly="status > 1"></Input>
          </Form-item>
          <Form-item label="公司联系电话：" prop="contactNo">
            <Input v-model="formItem.contactNo" size="large" placeholder="请输入" :maxlength="20" :readonly="status > 1"></Input>
          </Form-item>
          <Form-item label="公司邮箱：" prop="email">
            <Input v-model="formItem.email" size="large" placeholder="请输入" :readonly="status > 1"></Input>
          </Form-item>
          <Form-item label="企业法人姓名：" prop="businessEntity">
            <Input v-model="formItem.businessEntity" size="large" placeholder="请输入" :maxlength="20" :readonly="status > 1"></Input>
          </Form-item>
          <Form-item label="企业法人身份证：" prop="idCardNo">
            <Input v-model="formItem.idCardNo" size="large" placeholder="请输入" :maxlength="18" :readonly="status > 1"></Input>
          </Form-item>
          <Form-item label="法人手机号：" prop="mobile">
            <Input v-model="formItem.mobile" size="large" placeholder="请输入" :maxlength="11" :readonly="status > 1"></Input>
          </Form-item>
          <Form-item label="公司地址：" prop="address">
            <Input v-model="formItem.address" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="请输入" :readonly="status > 1"></Input>
          </Form-item>
          <Form-item label="企业营业执照所在地：" prop="permitAddress">
            <Input v-model="formItem.permitAddress" size="large" placeholder="请输入" :maxlength="20" :readonly="status > 1"></Input>
          </Form-item>
          <div class="new-line">
            <Form-item label="公司经营范围：" prop="businessScope">
              <Input v-model="formItem.businessScope" size="large" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="请输入" :readonly="status > 1"></Input>
            </Form-item>
          </div>
          <div class="new-line">
            <Form-item label="公司企业简介：" prop="summary">
              <Input v-model="formItem.summary" size="large" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="请输入" :readonly="status > 1"></Input>
            </Form-item>
          </div>
        </div>
      </Form>
    </div>
    <div style="border: 1px dashed #D9D9D9;margin:10px 0"></div>
    <div class="enterprise-info">
      <img src="~assets/img/icon_data.png" alt="">
      <p>企业附件资料</p>
    </div>
    <div class="enterprise-base-info-wrapper">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="180" label-position="left">
        <div class="enterprise-picture">
          <Form-item v-for="(item,i) in uploadItems" :key="i" :label="item.title" :ref="item.fields" :prop="item.prop">
            <div class="file-upload-wrapper">
              <a class="file-status" @click="showGallery(item.fields)">
              {{item[item.fields] ? item.title.replace('：','') : (status <= 1 ? '未选择文件' : '')}}</a>
              <a class="file-btn" v-if="status <= 1">
                <span>上传</span>
                <input type="file" :name="item.fields" @change="upLoad($event)" />
              </a>
            </div>
          </Form-item>
          <div class="confirm-btn" v-show="status === 0">
            <Button type="warning" long @click.native="commit('formItem')">提交资料审核</Button>
          </div>
        </div>
      </Form>
    </div>
    <Modal v-model="gallery" :width="800">
      <div slot="header"></div>
      <div slot="footer"></div>
      <div id="gallery-show"></div>
    </Modal>
  </div>
</template>

<script>
  import fillForm from './export'
  export default {
    ...fillForm
  }
</script>

<style>
  .enterprise-base-info .ivu-form-item {
    width: 460px;
  }
  .enterprise-base-info .ivu-modal-header,
  .enterprise-base-info .ivu-modal-footer {
    border: 0
  }
  .ivu-form .ivu-form-item-label {
    font-size: 14px;
  }
  .ivu-form-item-content {
    font-size: 14px;
  }
  .ivu-modal-close .ivu-icon-ios-close-empty{
    color: #000;
  }
</style>

<style lang="less" scoped>
  .enterprise-info-wrap {
    background: #fff;
    padding: 20px 40px;
    border-radius: 4px;
    margin-bottom: 20px;
    .enterprise-info {
      display: flex;
      align-items: center;
      img {
        margin: 5px;
      }
    }
    .user-status{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      p{
        flex-basis: 50%;
        color: #fc7231;
      }
    }
    .enterprise-base-info-wrapper {
      .enterprise-base-info {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      .new-line {
        flex-basis: 100%;
        .ivu-form-item {
          width: 100%;
        }
      }
      .file-status {
        width: 160px;
        white-space: nowrap;
        text-decoration: underline;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0 10px;
      }
      .file-btn {
        position: relative;
        display: inline-block;
        background: #0D88EB;
        color: #fff;
        border-radius: 4px;
        padding: 4px 16px;
        overflow: hidden;
        text-decoration: none;
        text-indent: 0;
        line-height: 24px;
        vertical-align: middle;
        & input {
          position: absolute;
          font-size: 100px;
          right: 0;
          top: 0;
          opacity: 0;
          cursor: pointer;
        }
      }
      .enterprise-picture {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-top: 20px;
        .ivu-form-item {
          flex-basis: 50%;
          width: 100%;
        }
        div:nth-last-of-type(2) {
          flex-basis: 100%;
        }
        .confirm-btn {
          flex-basis: 100%;
          text-align: center;
          margin-top: 40px;
          .ivu-btn-long {
            width: 25%;
          }
          .ivu-btn {
            font-size: 14px;
          }
        }
      }
      .file-upload-wrapper {
        display: flex;
      }
    }
  }
  #gallery-show{
    height: 600px;
  }
</style>
