<template>
  <div class="container" id="app">
  <h2>Product List</h2>

  <form class="form-horizontal">
    <div class="form-group">
      <label for="filterName" class="col-lg-2 control-label">Filter by name</label>
      <div class="col-lg-3">
        <input type="text" class="form-control" placeholder="Enter name" @keyup="searchQuery">
      </div>
    </div>
  </form>

  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th>ID <a href="#" @click.prevent="sortBy('id')">&#8661;</a></th>
        <th>Name <a href="#" @click.prevent="sortBy('name')">&#8661;</a></th>
        <th>Qty <a href="#" @click.prevent="sortBy('qty')">&#8661;</a></th>
        <th>Availability <a href="#" @click.prevent="sortBy('availbl')">&#8661;</a></th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in currentList" :key="index">
        <th scope="row">{{ item.id }}</th>
        <td>{{ item.name }}</td>
        <td>{{ item.qty }}</td>
        <td>{{ item.availbl }}</td>
        <td><button type="button" class="btn btn-default" @click="deleteItem(index)">X</button></td>
      </tr>
    </tbody>
  </table>
  <ul class="pagination pagination-sm" v-if="products.length > 10">
    <li class="page-item" :class="[currentPage === page ? 'active' : '']" v-for="page in pages">
      <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
    </li>
  </ul>

  <div class="btn-group btn-group-justified">
    <a href="#" class="btn btn-info" :class="{active: isNewRowShown}" @click.prevent="isNewRowShown = !isNewRowShown">Add new row</a>
    <a href="#" class="btn btn-success" @click.prevent="addRandomContent">Demo data</a>
    <a href="#" class="btn btn-warning" @click.prevent="clearTable">Clear table</a>
    <a href="#" class="btn btn-danger" :class="{active: isExportDataShown}" @click.prevent="isExportDataShown = !isExportDataShown">Export table</a>
  </div>
<br/>

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
              <br/><label><input type="checkbox" checked v-model="newProduct.availbl"> {{ newProduct.availbl ? 'Available' : 'Not available' }}</label>
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
        <div class="col-md-10 col-sm-8">
          <div class="form-group">
            <label class="col-lg-2 control-label">Data</label>
              <textarea class="form-control" rows="3"></textarea>
          </div>
        </div>
        <div class="col-md-2 col-sm-4">
          <br/>
          <button type="submit" class="btn btn-success  btn-block">Import data from table</button>
          <button type="submit" class="btn btn-info  btn-block">Export data to table</button>
        </div>
      </div>
    </fieldset>
  </form>
</div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      products: [],
      newProduct: {
        id: 1,
        name: '',
        qty: null,
        availbl: true
      },
      currentPage: 1,
      isNewRowShown: false,
      isExportDataShown: false,
      isAvailable: true,
      initStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      sortedColumn: ''
    }
  },
  computed: {
    pages() {
      return Math.ceil(this.products.length / 10);
    },
    currentList() {
      var currentIndex = this.currentPage * 10 - 9;
      return this.products.slice(currentIndex, currentIndex + 10)
    }
  },
  methods: {
    getRandom: function(minim, maxim) {
      let min = Math.ceil(minim),
          max = Math.floor(maxim);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandString: function() {
      let finalStr = "";
      for (let i = 0, len = this.getRandom(3, 10); i < len; i++) {
        let randLetter = this.getRandom(0, this.initStr.length);
        finalStr += this.initStr[randLetter];
      };
      return finalStr;
    },
    addRandomContent() {
      let randomeRowsNum = this.getRandom(1, 10);

      for (let i = 0; i < randomeRowsNum; i++) {
        let randomAvail   = this.getRandom(0, 1)) ? "yes" : "no";
        let randomQty     = this.getRandom(0, 1000);
        let randomName    = this.getRandString();
        let newDataSet = {
          id: this.newProduct.id,
          name: randomName,
          qty: randomQty,
          availbl: randomAvail
        };
        this.products.push(newDataSet);
        this.newProduct.id++;
      };
    },
    addDataToTable() {
      const createProduct = JSON.parse(JSON.stringify(this.newProduct));
      this.products.push(createProduct);
      this.newProduct.id++;
    },
    deleteItem(index) {
      this.products.splice(index, 1);
    },
    clearTable() {
      this.products = [];
    },
    sortBy(type) {
      if (this.sortedColumn === type) {
        this.products.reverse();
      } else {
        this.products.sort((a, b) => a[type] > b[type] ? 1 : -1 );
        this.sortedColumn = type;
      }
    },
    searchQuery(value) {
      this.products.filter((product) => {
        return product.name.indexOf(value) !== -1;
      });
    }
  }
}
</script>
