package com.coreops.hub.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class LongDeserializer extends JsonDeserializer<Long> {
    
    private static final Logger logger = LoggerFactory.getLogger(LongDeserializer.class);
    
    @Override
    public Long deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        
        if (value == null || value.trim().isEmpty()) {
            logger.debug("Deserializing empty/null string to null Long");
            return null;
        }
        
        try {
            Long result = Long.parseLong(value);
            logger.debug("Deserialized '{}' to Long: {}", value, result);
            return result;
        } catch (NumberFormatException e) {
            logger.warn("Failed to parse '{}' as Long, returning null", value);
            return null;
        }
    }
}
