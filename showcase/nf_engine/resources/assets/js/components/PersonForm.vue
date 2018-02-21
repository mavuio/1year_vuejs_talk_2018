
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
  
  import store from '../store';
  
  
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
