### 20 year vue.js
#### lessons learned
<div>&nbsp;</div>
<div class=""></div>

<div class="left small">
Manfred <span class="color1">Wuits</span><br>
manfred@werkzeugh.at
</div>

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

