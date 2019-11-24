<template>
    <div>
     <v-card-title>
      <v-btn  @click="addBrand" color="primary">新增品牌</v-btn>
       <v-spacer/>
         <v-text-field
           append-icon="search"
           label="搜索"
           single-line
           hide-details
           v-model="search"/>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="brands"
        :pagination.sync="pagination"
        :total-items="totalBrands"
        :loading="loading"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{props.item.id}}</td>
          <td class="text-xs-center">{{props.item.name}}</td>
          <td class="text-xs-center"><img v-if="props.item.image" :src="props.item.image" width="130" height="40"/></td>
          <td class="text-xs-center">{{props.item.letter}}</td>
          <td class="text-xs-center">
            <v-btn icon >
              <i class="el-icon-edit"/>
            </v-btn>
            <v-btn icon >
              <i class="el-icon-delete"/>
            </v-btn>
          </td>
        </template>
      </v-data-table>

      <v-dialog v-model="show" max-width="600" scrollable v-if="show">
        <v-card>
          <v-toolbar dark dense color="primary">
            <v-toolbar-title>{{isEdit ? '修改品牌' : '新增品牌'}}</v-toolbar-title>
            <v-spacer/>
            <v-btn icon @click="show = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="px-5 py-2">
            <!-- 表单 -->
            <brand-form :oldBrand="brand" :isEdit="isEdit" @close="show = false" :reload="getDataFromApi"/>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
  import BrandForm from './BrandForm'

    export default {
      components: {
        BrandForm
      },
        name: "MyBrand",
        data(){
          return{
            headers: [
              {text: '品牌id',value: 'id',align: 'center',sortable: true},
              {text: '品牌名称',value: 'name',align: 'center',sortable: false},
              {text: '品牌LOGO',value: 'image',align: 'center',sortable: false},
              {text: '品牌首字母',value: 'letter',align: 'center',sortable: true},
              {text: '操作',value: 'id',align: 'center',sortable: true}
            ],
            brands:[],
            pagination:{},
            totalBrands: 0,
            loading: false,
            search: '',  //查询的搜索条件
            show: false,// 是否弹出窗口
            brand: {}, // 品牌信息
          }
        },
      created() {
          this.loadBrands();
      },
      watch:{
        search(){
          //当page等于1的时候,这个pagination会进行触发
          this.pagination.page = 1;
         this.loadBrands(); //// 不需要写
        },

        //监视pagination属性的变化
        pagination:{
          deep: true,   //deep为true,会监视pagination的属性即属性中对象属性的变化
          handler(){
            // 变化后的回调函数,这里我们再次调用loadBrands的方法
            this.loadBrands();
          }
        }
      },
      methods:{
          //分页查询品牌信息
          loadBrands(){
            this.loading = true;
            this.$http.get("/item/brands/page",{
              params:{
                //当前页
                page: this.pagination.page,
                //每页显示的行树
                rows: this.pagination.rowsPerPage,
                //排序字段
                sortBy: this.pagination.sortBy,
                //是否降序
                desc: this.pagination.descending,
                //搜索条件
                search : this.search
              }
            }).then(resp => {
              this.brands = resp.data.items;
              this.totalBrands = resp.data.total;
              this.loading = false;
            })
          },
        addBrand() {
          this.brand = {};
          this.isEdit = false;
          this.show = true;
        },
        addBrand() {
          this.brand = {};
          this.isEdit = false;
          this.show = true;
        },
        editBrand(item) {
          this.brand = item;
          this.isEdit = true;
          this.show = true;
          // 查询商品分类信息，进行回显
          this.$http.get("/item/category/bid/" + item.id)
            .then(resp => {
              this.brand.categories = resp.data;
            })

        },
        deleteBrand(item) {
          this.$message.confirm('此操作将永久删除该品牌, 是否继续?').then(() => {
            // 发起删除请求
            this.$http.delete("/item/brand?id=" + item.id,)
              .then(() => {
                // 删除成功，重新加载数据
                this.$message.success("删除成功！");
                this.getDataFromApi();
              })
          }).catch(() => {
            this.$message.info("删除已取消！");
          });

        },
        getDataFromApi() {
          this.loading = true;
          // 200ms后返回假数据
          window.setTimeout(() => {
            this.items = brandData.slice(0,4);
            this.totalItems = 100
            this.loading = false;
          }, 200)
        }
      }
    }
</script>

<style scoped>

</style>
