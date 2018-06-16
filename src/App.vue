<template>
  <div class="container" id="app">
  <h2>Product List <small class="text-success">Sample table with common functionality</small></h2>

  <form class="form-horizontal">
    <div class="form-group">
      <label for="filterName" class="col-lg-2 control-label">Filter by name</label>
      <div class="col-lg-3">
        <input type="text" class="form-control" placeholder="Enter name" @input="filterByName">
      </div>
    </div>
  </form>

  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th>ID <a href="#" @click.prevent="sortBy('id')">&#8661;</a></th>
        <th>Name <a href="#" @click.prevent="sortBy('name')">&#8661;</a></th>
        <th>Qty <a href="#" @click.prevent="sortBy('qty')">&#8661;</a></th>
        <th>Availability <a href="#" @click.prevent="sortBy('avail')">&#8661;</a></th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in products" :key="index">
        <th scope="row">{{ item.id }}</th>
        <td>{{ item.name }}</td>
        <td>{{ item.qty }}</td>
        <td>{{ item.avail }}</td>
        <td><button type="button" class="btn btn-default btn-sm" @click="deleteItem(index)" >X</button></td>
      </tr>
    </tbody>
  </table>
  <ul class="pagination pagination-sm" v-if="pages > 1">
    <li class="page-item" :class="{active: currentPage === page }" v-for="page in pages" :key="page">
      <a class="page-link" href="#" @click.prevent="setPage(page)">{{ page }}</a>
    </li>
  </ul>

  <div class="btn-group btn-group-justified">
    <a href="#" class="btn btn-info" :class="{active: isNewRowShown}" @click.prevent="isNewRowShown = !isNewRowShown">Add new row</a>
    <a href="#" class="btn btn-success" @click.prevent="addRandomContent">Demo data</a>
    <a href="#" class="btn btn-warning" @click.prevent="clearTable">Clear table</a>
    <a href="#" class="btn btn-danger" :class="{active: isExportDataShown}" @click.prevent="isExportDataShown = !isExportDataShown">Export table</a>
  </div>
<br/><br/>

<form v-if="isNewRowShown">
  <fieldset>
    <legend>Add new row</legend>
    <div class="row">
      <div class="col-sm-4">
        <div class="form-group">
          <label for="pName" class=" control-label">Product name</label>
          <input type="text" name="pName" class="form-control" required v-model="newProduct.name">
        </div>
      </div>
      <div class="col-sm-4">
        <div class="form-group">
           <label name="selectQty" class="control-label">Select quantity</label>
           <select class="form-control" name="selectQty" required v-model="newProduct.qty">
             <option v-for="qty in 10">{{ qty }}</option>
           </select>
         </div>
       </div>
       <div class="col-sm-2">
          <div class="form-group">
            <div class="checkbox">
              <br/><label><input type="checkbox" checked v-model="newProduct.avail"> {{ newProduct.avail ? 'Available' : 'Not available' }}</label>
            </div>
          </div>
        </div>
        <div class="col-sm-2">
          <br/>
          <button type="submit" class="btn btn-success btn-block" @click.prevent="addDataToTable">Add data</button>
        </div>
      </div>
    </fieldset>
  </form>
  <form v-if="isExportDataShown">
    <fieldset>
      <legend>Export / import table data</legend>
      <div class="row">
        <div class="col-md-8">
          <div class="form-group">
            <label class="col-lg-2 control-label">Data</label>
              <textarea class="form-control" rows="3" v-model="importedData"></textarea>
          </div>
        </div>
        <div class="col-md-4">
          <br/>
          <button class="btn btn-success  btn-block" @click.prevent="importData">Import data from table</button>
          <button class="btn btn-info  btn-block" @click.prevent="exportData(importedData)">Export data to table</button>
        </div>
      </div>
    </fieldset>
  </form>
  <br/><br/>  
</div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      newProduct: {
        id: 1,
        name: '',
        qty: null,
        availbl: true
      },
      isNewRowShown: false,
      isExportDataShown: false,
      isAvailable: true,
      importedData: ''
    }
  },
  computed: {
    products() {
      return this.$store.getters.currentPageContent;
    },
    pages() {
      return this.$store.getters.pages;
    },
    currentPage() {
      return this.$store.state.currentPage;
    }
  },
  methods: {
    getRandom (minim, maxim) {
      let min = Math.ceil(minim),
          max = Math.floor(maxim);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Create and add randome content to table
    addRandomContent () {
      let randomContent = [];
      let randomeRowsNum = this.getRandom(1, 10);

      for (let i = 0; i < randomeRowsNum; i++) {
        let newDataSet = {
          id: Math.random().toString(36).substr(2, 4),
          name: Math.random().toString(36).substr(2, 9),
          qty: this.getRandom(0, 1000),
          avail: this.getRandom(0, 1) ? true : false
        };
        randomContent.push(newDataSet);
      };
      this.$store.commit('addRandomContent', randomContent);
    },

    // Add new item to table via Add New Row
    addDataToTable() {
      this.newProduct.id = Math.random().toString(36).substr(2, 4);
      this.$store.commit('addProducts', this.newProduct);
      // Clear form
      this.newProduct = { name: '', qty: null, availbl: true };
    },

    // Delete single item from table
    deleteItem(index) {
      this.$store.commit('removeProduct', index);
    },

    // Clear whole store
    clearTable() {
      this.$store.commit('clearProducts');
    },
    
    // Set pagination page 
    setPage(pageNo) {
      this.$store.commit('setPaginationPage', pageNo);
    },
    
    // Add sorting by column
    sortBy(type) {
      this.$store.commit('sortByType', type);
    },

    // Filter list by product name
    filterByName(e) {
      this.$store.commit('filterByName', e.target.value);
    },

    // Import data from Vuex state to form field
    importData() {
      this.importedData = JSON.stringify(this.$store.state.products);
    },

    // Export data from field to table
    exportData(data) {
      this.$store.commit('addRandomContent', JSON.parse(data));
    }
  }
}
</script>
