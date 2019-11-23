<template>
    <div>
     <v-card-title>
      <v-btn color="primary">新增品牌</v-btn>
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
    </div>
</template>

<script>
    export default {
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
            console.log("查询")
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
          }
      }
    }
</script>

<style scoped>

</style>
