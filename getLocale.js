import fs from 'fs';
import axios from 'axios';
import a from './allCountry/a.js';
import b from './allCountry/b.js';
import c from './allCountry/c.js';
import Languages from './languages.js';

const getLanguageData = async (data, lang) => {
  let arr = [];
  await axios({
    method: 'post',
    url:
      'https://translation.googleapis.com/language/translate/v2?key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: {
      q: [...data],
      target: lang,
    },
  })
    .then(res => {
      const {
        data: { data = {} },
      } = res || {};
      data?.translations?.forEach(element => {
        arr.push(element?.translatedText || '');
      });
    })
    .catch(function(error) {
      console.log(error);
    });
  return arr;
};


// // 国家翻译
// const getTranslation = (BaseLang,a) => {
//   // const target = Object.keys(BaseLang);
//   const languageData = BaseLang.map(element => element.name);
//   const languages = Languages.languages;
//   languages.forEach(async (i, k) => {
//     let translation = {};
//     await getLanguageData(languageData, i.language).then(result => {
//       result.forEach((element, index) => {
//         translation[`${i.local}.country.${BaseLang[index].code}`] = element;
//       });
//       if (!result?.length) {
//         console.log('error', i, k);
//       }
//     });
//     // if (languages.length - 1 === k) {
//       fs.writeFileSync(`${i.language}-${a}-service.json`, JSON.stringify(translation));
//     // }
//   });
// };


// 省份翻译
const getTranslation =async (BaseLang,a) => {
  // const target = Object.keys(BaseLang);
  const states = BaseLang.map(elements => elements.states);
  const countryCode = BaseLang.map(elements => elements.code);
  // console.log(states)
  
  const languages = Languages.languages;
  languages.forEach(async (i, k) => {
    let translation = {};
   states.forEach(async (j, p)=>{
     let state = j.length>0 && j.map( ele=>ele.name)
     let code =  j.length>0 && j.map( ele=>ele.code)
     if(state) await getLanguageData(state, i.language).then(result => {
        result.forEach((element, index) => {
          translation[`${i.local}.country.${countryCode[p]}.${code[index]}`] = element;
        });
        // if (!result?.length) {
        //   console.log('error', i, k);
        // }
      });
      // if (languages.length - 1 === k) {
        fs.writeFileSync(`translation/${i.language}-${a}-service.json`, JSON.stringify(translation));
      // }
    });
  })

};

getTranslation(a,'a');
getTranslation(b,'b');
getTranslation(c,'c');
