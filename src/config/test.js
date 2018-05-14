let epNumber = '845C3A9F0A69039F72E7C760BCCE9930';
export const getLeave = function (){
    var id = this.$route.query.id;
    let comment = "xxxx";
    this.api.putComment(epNumber, id, comment).then(function (res) {
      console.log(res);
      console.log(123);
    }).catch(function (res) {
        console.log(res);
        console.log('更新留言接口');
      });
};

export const getRedpackList = function () {
    var self = this;
    var id = this.$route.query.id;
    this.api.getRedpackGrabList(epNumber, id).then(function (res) {
      self.dataListTotal = res.data.data.attr;
      self.dataListContent = res.data.data.list;
    }).catch(function (res) {
        console.log(res);
        console.log('失败');
      });
};

