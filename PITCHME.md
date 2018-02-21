
---
### form validation: 

+++?code=showcase/Fotos.vue&lang=html&title=Form-Validation #1: vee-validate 

<div class="small">@fa[minus-circle] validations are inter-mingled with presentational code.</div>

+++?code=showcase//showcase/PersonFormVuelidate.vue&lang=javascript&title=Form-Validation #2:vuelidate 
<div class="small">@fa[plus-circle] validation code is within the model</div>

```html
<div class="row">
  <form-group class="span-6 alpha" label="Geburtsdatum" :validator="$v.localPerson.gebdatum">
    <input type="text" class="form-control" v-model.trim="localPerson.gebdatum" 
    name="gebdatum" placeholder="TT.MM.JJJJ" @input="$v.localPerson.gebdatum.$touch()">
  </form-group>
</div>

```

---

### 20 year vue.js
#### lessons learned
<div>&nbsp;</div>
<div class=""></div>

<div class="left small">
Manfred <span class="color1">Wuits</span><br>
manfred@werkzeugh.at
</div>

---

+++?code=showcase/nf_engine/resources/assets/js/components/PersonForm.vue&lang=javascript&title=Using local-state for forms [PersonForm.vue]

@[98-100] (create slot in local components-state)
@[426] (load data from vuex-store on component-creation)
@[220] (use getters for that)
@[249] (be sure to use a cloned version, btw: ramda is a friend)


+++?code=showcase/nf_engine/resources/assets/js/store/index.js&lang=javascript&title=vuex-persistedstate [store/index.js]

@[6] (Step 1: import)
@[19](Step 2: select parts of state to preserve)
@[12](optional: define cache-key)
@[20](btw: "strict" is always a good idea)



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

