const state = {
    properties: null,
    propertyTypes: null,
    areaUnits: null,
    locations:null
}
const getters = {
    getPropertyList(state) {
        return state.properties;
    },
    getPropertyDetails:(state) => (propertyId) => {
        return state.properties !== null ?  state.properties.find(property => property.id == propertyId)?.property_detail : null;
    },
    getProperty:(state) => (propertyId) => {
        return state.properties !== null ?  JSON.parse(JSON.stringify(state.properties.find(property => property.id == propertyId))): null;
    },
    getPropertyTypes(state){
        return state.propertyTypes;
    },
    getAreaUnits(state){
        return state.areaUnits;
    },
    getLocationsByCityId:(state) => (cityId) => {
        return state.locations !== null ?  state.locations.filter(location => location.city_id == cityId) : null;
    }
}
const mutations = {
    mutatePropertyList(state, properties) {
        state.properties = properties;
    },
    mutatePropertyTypes(state, propertyTypes) {
        state.propertyTypes = propertyTypes;
    },
    mutateAreaUnits(state, areaUnits) {
        state.areaUnits = areaUnits;
    },
    mutateAddProperty(state, propertyData) {
        let property = [...state.properties];
        property = [...property,propertyData];
        state.properties = [...property];
    },
    mutateLocationByCityId(state,locations){
        state.locations = locations;
    }
}
const actions = {
    actionPropertyList({commit, state},properties){
        commit('mutatePropertyList', properties);
    },
    actionPropertyTypes({commit, state},propertyTypes){
        commit('mutatePropertyTypes', propertyTypes);
    },
    actionAreaUnits({commit, state},areaUnits){
        commit('mutateAreaUnits', areaUnits);
    },
    actionAddProperty({commit, state},propertyData){
        commit('mutateAddProperty', propertyData);
    },
    actionGetLocationsByCityId({commit, state},locations){
        commit('mutateLocationByCityId', locations);
    },
}

export default {
    state,
    getters,
    actions,
    mutations
};
