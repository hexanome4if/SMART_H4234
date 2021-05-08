package fr.insa_lyon.smart_back.config;

public class AuthenticationConfigConstants {
    public static final String SECRET = "Smart_Secret";
    public static final long EXPIRATION_TIME = 864000000; // 10 days
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String SIGN_UP_URL = "/inscription";
    public static final String WS_CONNECT_URL ="/secured/room/**";
    public static final String LEVELS = "/levels";
}
