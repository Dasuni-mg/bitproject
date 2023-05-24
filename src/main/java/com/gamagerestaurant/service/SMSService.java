package com.gamagerestaurant.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import com.gamagerestaurant.model.SMS;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

@Component
public class SMSService {
    public static final String ACCOUNT_SID = "";
    public static final String AUTH_TOKEN = "";
    public static final String FROM_NUMBER = "";

    public void send(SMS sms) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        Message message = Message.creator(new PhoneNumber(sms.getTo()), new PhoneNumber(FROM_NUMBER), sms.getMessage())
                .create();
    }

    public void receive(MultiValueMap<String, String> smscallback) {
    }
}
