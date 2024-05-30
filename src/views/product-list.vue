<template>

  
  <div id="app" class="min-h-screen flex flex-col">
    <a-layout class="flex-1 flex flex-col">
      <!--HEADER-->
      <a-layout-header class="grid justify-center items-center" :style="{ background: '#ffffff' }">
        <img src="../img/logo.jpg" alt="Logo" class="w-16 h-auto" />
      </a-layout-header>

      <!--CONTENT-->
      <a-layout-content class="p-2 flex-1" :style="{ background: '#ffffff' }">
        <div class="container mx-auto max-w-5xl grid gap-10">

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <template v-for="(item, index) in products" :key="index">
            <div class="w-full border-solid rounded-lg border-2 light-grey-500">
                <img :src="googleImageConvertToImage(item.image)">
                <div class="px-2 py-5"> 
                  <h5 class="font-bold ">{{ item.name }}</h5>
                  <p class="font-bold text-blue-500 text-sm mt-2">RM {{ parseFloat(item.price).toFixed(2) }}</p>
                </div>
                <div class="flex text-center p-2 gap-2" >
                    <div v-if="item.inCart" class="w-full px-2 flex items-center justify-between">
                      <a-button class="border-1 border-black" @click="decreaseQuantity(index)">-</a-button>
                      <span>{{ item.quantity }}</span>
                      <a-button class="border-1 border-black" @click="increaseQuantity(index)">+</a-button>
                    </div>
                    <a-button v-else class="w-full px-2" type="primary" @click="addToCart(index)">Buy Now</a-button>
                </div>
            </div>
            </template>

            <!-- Fixed button at the bottom of the screen -->
              <a-button v-if="totalPrice > 0" class="fixed bottom-0 left-0 right-0 m-2 px-4 py-1 bg-green-500" type="primary" @click="sendWhatsAppMessage">Place Order Now (RM {{ parseFloat(totalPrice).toFixed(2) }})</a-button>
              <a-button v-else class="fixed bottom-0 left-0 right-0 m-2 px-4 py-1 bg-green-500" type="primary" @click="sendWhatsAppMessage">Contact Us Now</a-button>

          </div>

        </div>
      </a-layout-content>

      <!--FOOTER-->
      <a-layout-footer class="text-center" :style="{ background: '#ffffff' }">©2024 Created by Lisa</a-layout-footer>
    </a-layout>
  </div>


</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { SpreadsheetHelper } from "sbp-google-sheet-helper";

const route = useRoute();

const products = ref([]);

// init
onMounted(async () => {

  const helper = new SpreadsheetHelper({
    fileId: "1p3UaBZHe6XAwyQvUELBph9q-RxN9bMCC8HzO7vHoLg8",
    deployKey: "AKfycbxkHrOky9CENk-JwGkRFUnzV5Eu84EEhVs6FN3qazXSD2_FmSCb1k-ZVP6ICDxxMXLAZQ",
  });

  const response = await helper.sheet("productList").getData("name");

  response.data.forEach(product => {
    product.quantity = 0;
    product.inCart = false;
  });
  products.value = response.data;

})

const googleImageConvertToImage = (link) => {
     return "https://lh3.googleusercontent.com/d/" + link.split('/')[5] + "=w500";
};

const addToCart = (index) => {
  const product = products.value[index];
  if (!product.inCart) {
    product.inCart = true;
    product.quantity = 1;
  }
};

const increaseQuantity = (index) => {
  products.value[index].quantity++;
};

const decreaseQuantity = (index) => {
  const product = products.value[index];
  if (product.quantity > 1) {
    product.quantity--;
  } else {
    product.inCart = false;
    product.quantity = 0;
  }
};

const totalPrice = computed(() => {
  return products.value.reduce((sum, product) => {
    if (product.inCart) {
      return sum + (product.price * product.quantity);
    }
    return sum;
  }, 0);
});

const sendWhatsAppMessage = () => {
  let text = '';
  if (totalPrice.value > 0) {
    let itemNumber = 1; 
    text = 'Hi! I would like to buy:\n\n';
    products.value.forEach(product => {
      if (product.inCart && product.quantity > 0) {
        text += `${itemNumber}. ${product.name} x ${product.quantity}\n`;
        itemNumber++; 
      }
    });
    text += `\nTotal: RM ${totalPrice.value.toFixed(2)}`;
  } else {
    text = 'Hi! I have a question about your products.';
  }

  //if there any referral contact number
  // if (route.query.ref) {
  //   text += `\n\nYour referral contact number is ${route.query.ref}`;
  // }

  const phoneNumber = "60173224154";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};


</script>