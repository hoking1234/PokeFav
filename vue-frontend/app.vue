<script setup>
const searchValue = ref('')
const pokemonList = ref([]);
const filteredPokemonList = ref([]);
const detailPokemonStats = ref({})
const favouritePokemon = ref(null);
const error = ref(null);
const detailPokemon = ref(null);
const detailVisible = ref(false);

function getIdFromUrl(url) {
  return url.split('/').filter(Boolean).pop()
}

async function getPokemonData(){
  const cachedData = localStorage.getItem('pokemonList');
  favouritePokemon.value = localStorage.getItem('favouritePokemon');
  if (cachedData) {
    pokemonList.value = JSON.parse(cachedData);
  } else {
    try{
      const {data} = await useFetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
      const responseResult = data.value.results
      pokemonList.value = responseResult;
      localStorage.setItem('pokemonList', JSON.stringify(responseResult));
    } catch (err) {
       error.value = 'Failed to load Pokemon data.';
    } 
  }
}

function pickFavourite(id){
  if (favouritePokemon.value){
    localStorage.removeItem('favouritePokemon')
  }
  favouritePokemon.value = id
  localStorage.setItem('favouritePokemon', id)
}


function filterPokemonList() {
  const query = searchValue.value.toLowerCase();
  if (!query) {
    filteredPokemonList.value = pokemonList.value;
  } else {
    filteredPokemonList.value = pokemonList.value.filter(pokemon => {
      const name = pokemon.name.toLowerCase();
      const id = getIdFromUrl(pokemon.url);
      return name.includes(query) || id.includes(query);
    });
  }
}

async function showPokemonDetail(pokemon) {
  detailVisible.value = true;
  detailPokemon.value = pokemon;
  const detailId = getIdFromUrl(pokemon.url)

  let PokemonStatsObject = JSON.parse(localStorage.getItem('PokemonStatsObject')) || {};

  if (PokemonStatsObject?.[detailId]) {
    detailPokemonStats.value = PokemonStatsObject[detailId];
  } else {
    const {data} = await useFetch(`https://pokeapi.co/api/v2/pokemon/${detailId}`);
    const pokeStat = {
      height: data.value.height,
      weight: data.value.weight,
      hp: data.value.stats[0].base_stat,
      attack: data.value.stats[1].base_stat,
      defense: data.value.stats[2].base_stat,
      specialAttack: data.value.stats[3].base_stat,
      specialDefense: data.value.stats[4].base_stat,
      speed: data.value.stats[5].base_stat,
    }
    if (PokemonStatsObject === null){
      PokemonStatsObject = {}
    }
    PokemonStatsObject[detailId]= pokeStat    
    localStorage.setItem('PokemonStatsObject', JSON.stringify(PokemonStatsObject))
    detailPokemonStats.value = pokeStat;
  }



}

watch(
    () => searchValue.value,
    (data) => {
      filterPokemonList()
    }
  )

onMounted(async () => {
  localStorage.removeItem('PokemonStatsObject')
  await getPokemonData()
  filterPokemonList()
}) 

</script>

<template>
  <div class="p-7">
    <h2> Pokédex </h2>
    <div>
      Search for a Pokémon by name or id number
    </div>
    <div class="flex mt-4">
      <div class="w-2/5">
        <div class="bg-white px-4 py-2 flex items-center gap-2 rounded-md">
          <input
            v-model="searchValue"
            placeholder="Name or id number"
            class="w-full text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <div class="items-center justify-center">
            <img src="/icons/search.svg" alt="search icon" class="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 grid-cols-2 lg:grid-cols-6">      
      <div v-for="pokemon in filteredPokemonList" :key="pokemon.name" @click="showPokemonDetail(pokemon)" class="cursor-pointer">
        <div class="relative max-w-sm bg-card-bg p-3 h-60 rounded-lg shadow-lg overflow-hidden">
          <div class="flex flex-row-reverse">
            <button class="bg-transparent text-secondary p-1 rounded-full focus:outline-none hover:bg-slate-200" @click="(event) => { pickFavourite(getIdFromUrl(pokemon.url)); event.stopPropagation(); }">
              <img :src="favouritePokemon==getIdFromUrl(pokemon.url)? `/icons/heart.svg` : '/icons/heart-empty.svg'" alt="Favorite Icon" class="w-6 h-6">
            </button>
          </div> 
          <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getIdFromUrl(pokemon.url)}.png`" alt="Pokemon Img" class="h-30 justify-self-center" />
          <p class="text mb-2 text-center">{{ pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) }}</p>
            <p class="text-gray-500 mb-4 text-sm text-center">{{ `${getIdFromUrl(pokemon.url)}`.padStart(4, '0') }}</p>
        </div>
      </div>
    </div>
  </div>

  <div v-if="detailVisible" class="relative">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg relative w-8/12 h-9/12">
        <button class="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-button-primary hover:button-primary-hover  w-10 h-10 rounded-full flex items-center justify-center" @click="detailVisible=false">
          <img :src="'/icons/xmark-solid.svg'" alt="Close Icon" class="w-6 h-6">
        </button>
        <div class="flex h-full">
          <div class="w-5/12 p-8 bg-white flex flex-col">
            <div class="flex flex-row-reverse">
              <img :src="favouritePokemon == getIdFromUrl(detailPokemon.url) ? '/icons/heart.svg' : '/icons/heart-empty.svg'" alt="Favorite Icon" class="w-10 h-10">
            </div> 
            <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getIdFromUrl(detailPokemon.url)}.png`" :alt="`${detailPokemon.name} Img`" class="h-8/12 justify-self-center" />
            <p class="text text-center">{{ detailPokemon.name.charAt(0).toUpperCase() + detailPokemon.name.slice(1) }}</p>
            <p class="text-gray-500 mb-4 text-center">{{ `${getIdFromUrl(detailPokemon.url)}`.padStart(4, '0') }}</p>
          </div>
          <div class="w-7/12 p-8 bg-slate-100">
            <p class="text-3xl">Stats</p>
            <div v-for="(value, key, index) in detailPokemonStats" :key="key" class="flex mt-4 gap-x-1">
              <div class="w-9/12 px-3 py-2" :class="index % 2 === 0 ? 'bg-white' : 'bg-slate-200'">
                <p class="text-sm font-medium">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</p>
              </div>
              <div class="w-3/12 px-3 py-2 text-right" :class="index % 2 === 0 ? 'bg-white' : 'bg-slate-200'">
                <p class="text-sm font-medium">{{ value }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
