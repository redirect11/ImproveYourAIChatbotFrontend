import { configureStore, combineReducers } from '@reduxjs/toolkit'
import assistantsReducer from './slices/AssistantsSlice';
import transcriptionsReducer from './slices/TranscriptionsSlice';
import handoverReducer from './slices/HandoverSlice';

const rootReducer = combineReducers({
    assistants: assistantsReducer,
    transcriptions: transcriptionsReducer,
    handover: handoverReducer,
});

const store = configureStore({
    reducer: {rootReducer}
});

export default store;
