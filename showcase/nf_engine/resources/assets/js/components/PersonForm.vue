<template>
  <div class="person-form">


      <div class="row form-header">
        <div class="span-12">
          <div class="form-headline"><i :title="localPerson.kategorie" class='fa fa-lg' :class="isMainPerson?'fa-user-circle':'fa-user-circle-o'"></i>&nbsp;{{personHeadline}}</div>
        </div>
      </div>

      <transition name="slide" mode="out-in">

      

      <div v-if='open' class='form-open' key="open">
        <div class="row">
          <form-group v-if="showMainMemberNumber" class="span-6 alpha" label="Mitgliedsnummer des Vollmitglieds" :validator="$v.localPerson.hhnr">
            <input type="text" class="form-control" v-model.trim="localPerson.hhnr" name="hhnr" @input="$v.localPerson.hhnr.$touch()">
          </form-group>
        </div>


        <div class="row">
          <form-group class="span-3 alpha" label="Anrede" :validator="$v.localPerson.sex">
            <select v-model="localPerson.sex"  placeholder="Anrede" class="form-control" @input="$v.localPerson.sex.$touch()">
              <option value='W'>Frau</option>
              <option value='M'>Herr</option>
            </select>      
          </form-group>
          <div class="form-group span-3"></div>

          <form-group class="span-3" label="Titel" :validator="$v.localPerson.titel" v-show="!hideTitel">
            <input type="text" class="form-control" v-model.trim="localPerson.titel" name="titel" @input="$v.localPerson.titel.$touch()">
          </form-group>
        </div> 


        <div class="row">
          <form-group class="span-6 alpha" label="Vorname" :validator="$v.localPerson.vorname">
            <input type="text" class="form-control" v-model.trim="localPerson.vorname" name="vorname" @input="$v.localPerson.vorname.$touch()">
          </form-group>

          <form-group class="span-6 omega" label="Nachname" :validator="$v.localPerson.nachname">
            <input type="text" class="form-control" v-model.trim="localPerson.nachname" name="nachname" @input="$v.localPerson.nachname.$touch()">
          </form-group>
        </div>

        <div class="row">
          <form-group class="span-6 alpha" label="Geburtsdatum" :validator="$v.localPerson.gebdatum">
            <input type="text" class="form-control" v-model.trim="localPerson.gebdatum" name="gebdatum" placeholder="TT.MM.JJJJ" @input="$v.localPerson.gebdatum.$touch()">
<!--             Alter:{{localPerson.kategorie}}  ageIsInRange:  {{ageMin}} &lt; <span v-if='ageIsInRange'>✔</span><span v-else>X</span> {{age}} &lt;{{ageMax}}
 -->          </form-group>
          <div class="span-6 omega" >
            
            <div v-if='isStudent' class="alert alert-success">Hinweis: Eine Inskriptionsbestätigung ist erforderlich.</div>

          </div>

        </div>


        <div class="row">
          <form-group class="span-6 alpha" label="e-Mail" :validator="$v.localPerson.email">
            <input class="form-control" type="text" v-model.trim="localPerson.email" name="email" @input="$v.localPerson.email.$touch()">

            <div>&nbsp;</div>
          </form-group>

          <form-group class="span-6 omega" label="Telefon" :validator="$v.localPerson.telefon">
            <input type="text" class="form-control" v-model.trim="localPerson.telefon" name="telefon" @input="$v.localPerson.telefon.$touch()">
          </form-group>
        </div>

        <div class="row">
          <div class="form-group span-12"  >
            <label class="control-label">Deine Interessen:</label>

            <div class="interessen">
              <span v-for="i in alleinteressen" :class="{active:isActiveInteresse(i.id)}" @click="toggleInteresse(i.id)" >{{i.name}}</span>
            </div>


          </div>
        </div>



       
        <div class="row">
          <form-group class="span-4" label="Land" :validator="$v.localPerson.land">
            <select name='land' :disabled="fixedAddress" v-model="localPerson.land"  class="form-control" @input="$v.localPerson.land.$touch()">
              <option v-for="option in $store.getters.laender" v-bind:value="option.id">
                {{ option.name}}
              </option>
            </select>      
          </form-group>
        </div>

        <div class="row">
          <form-group class="span-12 alpha" label="Adresse" :validator="$v.localPerson.adresse1">
            <input :disabled="fixedAddress" type="text" class="form-control" v-model.trim="localPerson.adresse1" name="adresse" @input="$v.localPerson.adresse1.$touch()">
          </form-group>
        </div>



        <div class="row" v-if='usePlzChooser'>
          
          <form-group :validator="$v.localPerson.plz" label="PLZ/Ort">
            <v-select :debounce="250" v-model='plzort' :on-search="getPlzorte" :options='plzorte' placeholder="Suche PLZ/Ort" @change="$v.localPerson.plz.$touch()" />

              <div>&nbsp;</div>
          </form-group>
        </div>

        <div class="row" v-else>
          <form-group class="span-4 alpha" label="PLZ" :validator="$v.localPerson.plz">
            <input :disabled="fixedAddress || usePlzChooser" type="text" class="form-control" v-model.trim="localPerson.plz" name="plz" @input="$v.localPerson.plz.$touch()">
          </form-group>

          <form-group class="span-8 omega" label="Ort" :validator="$v.localPerson.ort">
            <input :disabled="fixedAddress || usePlzChooser" type="text" class="form-control" v-model.trim="localPerson.ort" name="ort" @input="$v.localPerson.ort.$touch()">
          </form-group>
        </div>
        


      

         <div class="row" v-if="isMainPerson">

          <form-group class="span-12" label="Wähle dein Bundesland & deine Ortsgruppe"  :validator="$v.localPerson.ognr">
            <div class="row">
              <div class="span-6 alpha">
                <select  v-model="localPerson._bundesland"  class="form-control">
                  <option v-for="option in bundeslaender" v-bind:value="option">
                    {{ option}}
                  </option>
                </select>
              </div>
              <div class="span-6 omega">

                <select v-model="localPerson.ognr"  class="form-control" v-visible="localPerson._bundesland" input="$v.localPerson.ognr.$touch()">
                  <option v-for="option in ortsgruppenPerBundesland " v-bind:value="option.id">
                    {{ option.name}}
                  </option>
                </select>
              </div>
            </div>
          </form-group>

        </div>

        <div class="row" v-if='isMainPerson'> 
          <form-group class="span-6 alpha" label="Mitgliedsnummer der Werberin/des Werbers" :validator="$v.localPerson.werber">
            <input type="text" class="form-control" v-model.trim="localPerson.werber" name="werber" @input="$v.localPerson.werber.$touch()">
          </form-group>
        </div>


      </div>
      <div v-else class='form-closed' key="closed">
        <div class="row" v-if="localPerson && localPerson.vorname">
          <div class="span-12 person-details">

            <div v-if="localPerson.titel"><span>Titel:</span><div>{{localPerson.titel}}</div> </div>
            <div><span>Vorname:</span><div>{{localPerson.vorname}}</div> </div>
            <div><span>Nachname:</span><div>{{localPerson.nachname}}</div></div>
            <div><span>Geburtsdatum:</span><div>{{localPerson.gebdatum}}</div></div>
            <div><span>e-Mail:</span><div>{{localPerson.email}}</div></div>
            <div><span>Telefon:</span><div>{{localPerson.telefon}}</div></div>
            <div><span>Interessen:</span><div>
              <span v-for="(item, index) in expandedInteressen"><template v-if="index">, </template>{{item.name}}</span>
            </div></div>
            <div>
              <span class="person-label">Adresse:</span>
              <div>{{localPerson.adresse1}}<br>
              {{localPerson.land}} - {{localPerson.plz}} {{localPerson.ort}}</div>        
            </div>
          </div>
        </div>
      </div>
    </transition>




    <div class="row form-footer">
      <div class="span-12">
        <div v-if="saving" class="saving-div">
          speichern... <i class='fa fa-spin fa-spinner'></i>
        </div>
        <div v-else>
          <template v-if='open'>
            <button v-show="optional" class="btn btn-default" type="button" @click="removePerson()"><i class="fa fa-trash"></i> Person entfernen</button>
            <button v-if='$parent.mainPerson' class="btn btn-default" type="button" @click="cancelEdit()"><i class="fa fa-times"></i> abbrechen</button>
            <button class="btn" :class="$v.localPerson.$invalid?'btn-default':'btn-nf2'"  type="button" @click="savePerson()"><i class="fa fa-check"></i> Speichern</button>
          </template>
          <template v-else>
            <button v-show="showOpenButton" class="btn" :class="isComplete?'btn-default':'btn-nf2'" type="button" @click="editPerson()"><i class="fa fa-pencil"></i> Bearbeiten</button>
          </template>
        </div>
      </div>
    </div>
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
import store from '../store';
// import {checkIfMitgliedsNrIsValid} from '../store/actions';



const plz = withParams({type: 'plz'}, function(value){ 

  return !!(value && value.match(/^\d\d\d\d\d?$/));

});

const isObject= thing => (typeof thing === "object") && (thing !== null);

const mitgliedsnr = withParams({type: 'mitgliedsnr'}, function(mglnr){ 

      if(R.prepend())
        if(R.isNil(mglnr) || R.isEmpty(mglnr)) {
          return true;
        }


        if(!String(mglnr).match(/^\d\d\d\d\d\d$/)) {
          return false;
        }

        const ret=store.dispatch('checkIfMitgliedsNrIsValid',mglnr);
        console.log('#return promise',ret);
        return ret;

});
// example: https://github.com/monterail/vuelidate/issues/137




import customFormGroup from './FormGroup.vue';


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


const isDate = (value) => moment(value, 'DD.MM.YYYY', true).isValid();
const today = moment();

const getAgeFromDatum= (datum) => {
    if(isDate(datum)) {
        return today.diff(moment(datum, 'DD.MM.YYYY', true), 'years');
    } else {
        return null;

    }
};




export default {
  name: 'PersonForm',
  props:{
    showOpenButton:{Type:Boolean,default:false},
    open:{Type:Boolean,default:true},
    version:{Type:Number,required:true},
    personKey:{Type:String,required:true},
    personHeadline:{Type:String,required:true},
    optional:{Type:Boolean,required:false,default:false},
    fixedAddress:{Type:Boolean,required:false,default:false},
    showMainMemberNumber:{Type:Boolean,required:false,default:false},
    hideTitel:{Type:Boolean,required:false,default:false},
  },
  data: function () {
    return {
      localPerson:null,
      saving:false,
      plzorte:[],
      asyncTemplate: '{{ item.label }}',
    };
  },
  computed:{
    'plzort': {
      get:function() {
        if(!R.isEmpty(this.localPerson.plz) && !R.isEmpty(this.localPerson.ort) ) {
          return this.localPerson.plz+' - '+this.localPerson.ort;
        }
        return '';
      },
      set:function(value) {
        if(isObject(value) && value.plz && value.ort) {
          this.localPerson.plz=value.plz;
          this.localPerson.ort=value.ort;
        }
      }
    },
    usePlzChooser:function () {
      return !this.fixedAddress && this.localPerson && this.localPerson.land==='A';
    },
    plzSearchUrl:function () {
      return augmentApiUrl('https://madb.naturfreunde.at/NFOEMADB/Autocomplete_TB_Search_PLZ_Ort.ashx');
      // return augmentApiUrl(this.$store.getters.apiUrl+'/search-plz-ort');
    },
    isMainPerson:function () {
      return this.personKey==='person1';
    },
    'age':function () {
      if(this.localPerson) {
        return getAgeFromDatum(this.localPerson.gebdatum);
      } else {
        return null;
      }
    },
    ageMinMax:function () {

      const  ages=[18,200];

      switch(this.localPerson.kategorie) {
        case 'J':
        case 'FJ':
        case 'FS':
          return [1,27];
        case 'EJ':
          return [18,25];
        case 'ES':
          return [18,27];
      }
      return ages;

    },
    isStudent:function () {
      return R.contains(this.localPerson.kategorie,['FS']);
    },
    ageMin:function () {
      return this.ageMinMax[0];
    },
    ageMax:function () {
      return this.ageMinMax[1];
    },
    // ageIsInRange:function () {
    //   return this.age>=this.ageMin && this.age<=this.ageMax
    // },
    isComplete: function (){
       return !(this.$v.localPerson.$invalid);
    },
    alleinteressen:function () {
      return this.$store.getters.interessen;
    },
    expandedInteressen:function () {
      let interessen=this.localPerson.interessen;
      return this.$store.getters.interessen.filter(function(i) { 
          return R.contains(i.id, interessen);
         });
    },
    bundeslaender:function () {
      return R.compose(R.filter(name => name.length>1 ),R.uniq, R.pluck('bundesland'))(this.$store.getters.ortsgruppen);
    },
    ortsgruppenPerBundesland:function () {
      let bl=this.localPerson._bundesland;
      return this.$store.getters.ortsgruppen.filter(R.propEq('bundesland', bl));
    },
  },
  components:{
    vSelect,
  },
  methods: {
    getPlzorte(search, loading) {
      loading(true);
      axios.get(this.plzSearchUrl, {params:{
       q: search}
     }).then(resp => {
       this.plzorte = resp.data;
       loading(false);
     })
    },

    isActiveInteresse: function (id) {
      return R.contains(id,this.localPerson.interessen);
    },
    fetchMglNrIfNeeded:function () {
      if(!this.localPerson.mglnr) {
        return this.$store.dispatch('getNewMglnr',this.personKey).then( (mglnr)=> {
          this.localPerson.mglnr=mglnr;
          if(this.localPerson.kategorie==='V'){
            this.localPerson.hhnr=mglnr;
          }
          if( R.contains(this.localPerson.kategorie,['FV','FVE','AF','AFE']) ){
            this.localPerson.familiennr=mglnr;
          }

        });
      }

    },
    fetchPerson:function () {
      let p=this.$store.getters.getPersonForKey(this.personKey);
      console.log('#fetchPerson',this.personKey,p);
      if(p===false) {
        return p;
      }
      if (p===null) {
        p={
          mglnr:'',
          titel:'',
          vorname:'',
          nachname:'',
          sex:'',
          email:'',
          telefon:'',
          adresse1:'',
          gebdatum:'',
          kategorie:'',
          zahlungmit:'TELEBANKING',
          plz:'',
          ort:'',
          land:'A',
          interessen:[],
          familiennr:0,
          hhnr:0,
          werber:0,
          _bundesland:this.$store.getters.defaultOg?this.$store.getters.defaultOg._bundesland:null,
          ognr:this.$store.getters.defaultOg?this.$store.getters.defaultOg.ognr:null,
        };
      } else {
        p=R.clone(p);
      }
      if(!p.interessen && !p.interessen.isArray ) {
        p.interessen=[];
      } 
      if(!p.kategorie) {
        p.kategorie=this.getKategorie();
      }

      if(this.showMainMemberNumber && ( !p.hhnr || p.hhnr===0) ) {
          p.hhnr='';
      }
      if(this.isMainPerson && ( !p.werber || p.werber===0) ) {
          p.werber='';
      }
      if(this.fixedAddress) {
        return this.$parent.updateAddressOnPerson(p);
      }
      return {...p};
    },
    getKategorie:function (age=null) {
      const type=this.$store.getters.currentAnmeldung.membershipType;
      if(this.personKey==='person1') {
        switch(type) {
          case 'regular':
              return 'V';
          case 'addon':
              return 'EA';
          case 'youth':
              return 'J';
          case 'youngadults':
              return 'EJ';
          case 'student':
              return 'ES';
          case 'discount':
              return 'EM';
          case 'family':
              return 'FV';
          case 'family2':
              return 'AF';
          default:
        }
      }
      if(this.personKey==='personplus') {
          return 'EA';
      }
      if(this.personKey==='person2') {
          return 'FA';
      }
      if(this.personKey.match('child')) {
        if(age>19 && age<=27) {
          return 'FS';
        } else {
          return 'FJ';
        }
      }
      // return 'I';
      return type+'/'+this.personKey;
    },
    toggleInteresse:function (id) {
      if(R.find(R.equals(id))(this.localPerson.interessen)) {
         this.localPerson.interessen=R.reject(R.equals(id), this.localPerson.interessen);

      } else {         
        this.localPerson.interessen.push(id);
      }
    },
    editPerson:function () {
      if(this.localPerson===false) {
        this.$store.commit('setPersonData', {personKey:this.personKey, personData:null}); // open form
        this.$store.commit('incrementVersion');

      }
      this.$store.commit('setCurrentPersonKey', this.personKey); // open form
    },
    cancelEdit:function () {
      this.$store.commit('setCurrentPersonKey', null); // close form 
      this.$store.commit('incrementVersion');     
    },
    savePerson:function () {
      if(this.$v.localPerson.$invalid) {
        this.$v.localPerson.$touch();
        alert('Bitte fülle alle rot markierten Felder aus.');
      } else if(!this.localPerson.mglnr) {
        this.fetchMglNrIfNeeded();
        alert('die Verbindung zum Mitglieder-Server ist unterbrochen, bitte versuche später nochmal zu speichern.');
      } else {
        this.$store.commit('setPersonData', {personKey:this.personKey, personData:this.localPerson});
        this.saving=true;
        this.$store.dispatch('sendPerson',this.personKey).then( () => {
            this.saving=false;
            this.$store.commit('setCurrentPersonKey', null); // close form
            this.$emit('save',{personKey:this.personKey, personData:this.localPerson});
           },
            () => {
              alert("Es ist ein Fehler aufgetreten. Die Daten konnten leider nicht gespeichert werden.");
              this.saving=false;
           });

      }
    },
    removePerson:function () {
      this.$store.commit('setPersonData', {personKey:this.personKey, personData:false});
      this.$store.commit('setCurrentPersonKey', null); // close form
      this.$store.commit('incrementVersion');
      this.$emit('remove',{personKey:this.personKey});
    },
    fetchInteressenIfNeeded:function () {
      if(this.$store.getters.interessen.length===0) {
        this.$store.dispatch('fetchInteressen');
      }
    },
  },
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
  watch: {
    version: function () {
      this.localPerson=this.fetchPerson();
    },
    'age':function (age) {
      if(R.contains(this.localPerson.kategorie,['FJ','FS'])) {
        this.localPerson.kategorie=this.getKategorie(age);
      }
    },
    '$v.localPerson.gebdatum.$invalid':function () {
      if(this.$v.localPerson.gebdatum.$invalid===false) {
        this.fetchMglNrIfNeeded();
      } 
    },
  },
  created:function () {
    this.localPerson=this.fetchPerson();
    this.fetchInteressenIfNeeded();
  },
};

</script>

<style lang="scss">

@import "../styles/settings.scss";

.person-form {

  .slide-enter-active, .slide-leave-active {
    transition: max-height .5s;
    overflow: hidden;
  }
  .slide-enter, .slide-leave-to {
    max-height: 50px;
  }

  .slide-leave, .slide-enter-to {
    max-height: 1000px;
  }

  .interessen {
    > span {
      border-radius: 0.5em;
      border: 1px solid $c-green;
      padding: .4em 1em;
      display: inline-block;
      margin: .5em .2em;
      color: $c-green;
      cursor: pointer;
      &:hover, &.active {
        color: white;
        background: $c-green;
      }
    }

  }

  .person-details {
    padding: 0 1em;
    > div {
      @include flexbox;
      > * {
        margin-top: .3em;
        margin-bottom: .3em;
      }
      > span {
        @include flex(1, 1, 10em);
        color: $c-green;
      }
      > div {
        @include flex(1, 1, 70%);
        // border:1px solid red;
      }
    }
  }

  .has-error .v-select .dropdown-toggle {
    border-color: #a94442;
  }
  .has-success .v-select .dropdown-toggle {
    border-color: #3c763d;
  }

  .saving-div {
    padding: 1em;
    text-align: center;
    font-weight: bold;
    font-size: 1.5em;
  }

  .form-header {
    background: #efefef;
    border-top: 2px solid $c-green;
    .form-headline {
      padding: .5em;
      font-size: 1.5em;
      font-weight: bold;
    }
    // margin-bottom: 1em;
  }
  .form-footer {
    background: #efefef;
    text-align: right;
    border-bottom: 2px solid $c-green;
    padding: 1em;

    margin-bottom: 1em;

  }
  .form-open, .person-details {
    padding-top: 1em;
    padding-bottom: 1em;

  }

}

</style>
