### 20 year vue.js
#### lessons learned
<div>&nbsp;</div>
<div class=""></div>

<div class="left small">
Manfred <span class="color1">Wuits</span><br>
manfred@werkzeugh.at
</div>
---

```html
<template>
  <div class="person-form">


      <div class="row form-header">
        <div class="span-12">
          <div class="form-headline"><i :title="localPerson.kategorie" class='fa fa-lg' :class="isMainPerson?'fa-user-circle':'fa-user-circle-o'"></i>&nbsp;{{personHeadline}}</div>
        </div>
      </div>

      <transition name="slide" mode="out-in">

      </transition>
      </div>
      </template>

<script>

// const {create, env} = require('sanctuary');
// const checkTypes = process.env.NODE_ENV !== 'production';
// const S = create({checkTypes, env});
const R = require('ramda');
import {augmentApiUrl} from '../utils';

import Vue from 'vue';
import vuelidate from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';
import { withParams } from 'vuelidate/lib';
import vuelidateErrorExtractor from 'vuelidate-error-extractor';
import moment from 'moment';
import axios from 'axios';

import vSelect from 'vue-select';

// some JS file
// Include http module.
var http = require("http");

// Create the server. Function passed as parameter
// is called on every request made.
http.createServer(function (request, response) {
  // Attach listener on end event.  This event is
  // called when client sent, awaiting response.
  request.on("end", function () {
    // Write headers to the response.
    // HTTP 200 status, Content-Type text/plain.
    response.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    // Send data and end response.
    response.end('Hello HTTP!');
  });

// Listen on the 8080 port.
}).listen(8080);
</script>

```





---
vuex:
localstate / vuex-persistedstate 


+++?code=showcase/nf_engine/resources/assets/js/components/PersonForm.vue&lang=javascript&title=Using local-state for forms[PersonForm.vue]

@[307-309] (create slot in local components-state)
@[635] (load data from vuex-store on component-creation)
@[429] (use getters for that)
@[458] (be sure to use a cloned version, btw: ramda is a friend)


+++?code=showcase/nf_engine/resources/assets/js/store/index.js&lang=javascript&title=vuex-persistedstate [store/index.js]

@[6] (Step 1: import)
@[19](Step 2: select parts of state to preserve)
@[12](optional: define cache-key)
@[20](btw: "strict" is always a good idea)



---
form validation: 
vee-validate vs vuelidate 
---
icons: 
vue-svgicons  vs fontawesome5i
---
bundle sizes: 
vue lazy-loading w/o router & webpack bundle size-previews 
---
components: 
vue-strap  vs  buefy-components 
---
content: 
server-side (laravel)  vs  headless-cms (storyblok)

