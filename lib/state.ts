
import { ExtractedData, ExtractedItem, ItemType, Signal, Insight, Opportunity, Idea } from '../types';

// Helper to ensure an item from localStorage has all required client-side fields
const sanitizeItem = (item: any, type: ItemType): ExtractedItem | null => {
    // An item is invalid if it's not an object or doesn't have a 'text' property.
    if (!item || typeof item.text !== 'string' || !item.text.trim()) {
        return null; 
    }
    return {
        id: item.id || Math.random().toString(36).substring(2, 9),
        type: type,
        text: item.text,
        speaker: item.speaker || (type === 'signals' ? 'Unknown' : 'PM'),
        okrIds: Array.isArray(item.okrIds) ? item.okrIds.filter(id => typeof id === 'string') : [],
        tags: Array.isArray(item.tags) ? item.tags.filter(tag => typeof tag === 'string') : undefined,
    };
};


// Main function to load and validate data from localStorage
export const loadStateFromLocalStorage = (): ExtractedData | null => {
    try {
        const serializedState = window.localStorage.getItem('insight_map_data');
        if (serializedState === null) {
            return null;
        }
        
        const parsedState = JSON.parse(serializedState);

        // Basic validation: ensures the stored state is a non-null object.
        if (typeof parsedState !== 'object' || parsedState === null) {
            console.warn("Invalid state in localStorage: not an object.");
            window.localStorage.removeItem('insight_map_data');
            return null;
        }

        // Deep validation and sanitation of the data structure.
        // It ensures each category is an array and each item within it is valid.
        const sanitizedData: ExtractedData = {
            signals: (Array.isArray(parsedState.signals) 
                ? parsedState.signals.map((item: any) => sanitizeItem(item, 'signals')).filter(item => item !== null)
                : []) as Signal[],
            insights: (Array.isArray(parsedState.insights) 
                ? parsedState.insights.map((item: any) => sanitizeItem(item, 'insights')).filter(item => item !== null)
                : []) as Insight[],
            opportunities: (Array.isArray(parsedState.opportunities)
                ? parsedState.opportunities.map((item: any) => sanitizeItem(item, 'opportunities')).filter(item => item !== null)
                : []) as Opportunity[],
            ideas: (Array.isArray(parsedState.ideas)
                ? parsedState.ideas.map((item: any) => sanitizeItem(item, 'ideas')).filter(item => item !== null)
                : []) as Idea[],
        };

        return sanitizedData;

    } catch (error) {
        console.error("Could not load state from localStorage", error);
        // If parsing fails or any other error occurs, clear the corrupt data.
        window.localStorage.removeItem('insight_map_data');
        return null;
    }
};
