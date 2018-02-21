
---
##### form validation: 

+++?code=showcase/Fotos.vue&lang=html&title=Form-Validation #1: vee-validate 

<div class="smaller">@fa[minus-circle] validations are inter-mingled with presentational code.</div>

+++
##### Form-Validation #2: vuelidate - validations

```javascript
 validations: function() {
    let validations={
        vorname:{required},
        nachname:{required},
        sex:{required},
        titel:{},
        email:{required, email},
        gebdatum:{
          required,
          isDate (value) {
            return isDate(value);
          },
          isValidAge (value) {
            const age=getAgeFromDatum(value);
            if(age!==null) {
              return age >= this.ageMin && age <= this.ageMax;
            } else {
              return true;
            }
          },
        },
        telefon:{required},
        adresse1:{required},
        plz: { required, plz},
        ort:{required},
        land:{required},
        ognr:{required},
        _bundesland:{required},
    };

    if(this.fixedAddress) {
      validations=R.omit(['_bundesland','ognr','adresse1','plz','ort','land'],validations);
    }

    if(this.showMainMemberNumber) {
      validations.hhnr={required,mitgliedsnr};
    }

    if(this.isMainPerson) {
      validations.werber={mitgliedsnr};
    }

    if(this.personKey.match('child')) {
      validations=R.omit(['telefon'],validations);
    }
    return { localPerson: validations };

  },
```

<div class="smallest">@fa[plus-circle] validation code is within the model</div>

+++ 

##### Form-Validation #2: vuelidate - markup

```html
<div class="row">
  <form-group class="span-6 alpha" label="Geburtsdatum" 
    :validator="$v.localPerson.gebdatum">
    <input type="text" class="form-control" v-model.trim="localPerson.gebdatum" 
    name="gebdatum" placeholder="TT.MM.JJJJ" @input="$v.localPerson.gebdatum.$touch()">
  </form-group>
</div>
...
<div class="row" v-if='usePlzChooser'>
  <form-group :validator="$v.localPerson.plz" label="PLZ/Ort">
    <v-select :debounce="250" v-model='plzort' :on-search="getPlzorte" 
    :options='plzorte' placeholder="Suche PLZ/Ort" @change="$v.localPerson.plz.$touch()" />
      <div>&nbsp;</div>
  </form-group>
</div>

```

+++ 

##### vuelidate-error-extractor - markup Helper

import vuelidateErrorExtractor from 'vuelidate-error-extractor';

import customFormGroup from './FormGroup.vue';

```javascript
Vue.use(vuelidate);
Vue.use(vuelidateErrorExtractor, {
  template: customFormGroup,
  messages: {
    required: 'Dieses Feld ist ein Pflichtfeld',
    email: 'Bitte eine gültige e-Mail Adresse eintragen',
    isDate: 'Bitte ein gültiges Datum im Format TT.MM.JJJJ angeben',
    isValidAge: 'Geburtsdatum ist nicht im erforderlichen Altersbereich',
    plz: 'Bitte eine gültige PLZ eingeben',
    mitgliedsnr: 'Bitte eine gültige Mitgliedsnummer eingeben',
     },
});
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

