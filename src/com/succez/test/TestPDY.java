package com.succez.test;

import java.util.HashMap;

import com.itextpdf.text.pdf.IntHashtable;

public class TestPDY {

	private static int[] ws = { 3, 7, 9, 10, 5, 8, 4, 2 };  
	private static final String str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//	private static final HashMap IDX = new  HashMap();
	private static final IntHashtable IDX = new IntHashtable();
	
	/**
	 * 代码字符集
	 */
	private static final String CHAR_SET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	private static short [] chars = new short[((int)'Z')+1];
	
	static {
		for(short i=0; i<CHAR_SET.length(); i++){
			char ch = CHAR_SET.charAt(i);
			chars[ch] = i;
		}
	}
	
	static {
		for (int i = 0; i < str.length(); i++) {
			IDX.put(str.charAt(i), i);
		}
	}
	
	public static void main(String[] args) {
		long s = System.currentTimeMillis();
		for (int i = 0; i < 1000000; i++) {
			pdy3("23D45Z12");
		}
		long e = System.currentTimeMillis();
		System.out.println(e-s);
	}
/*
	String regex = "^([0-9A-Z]){8}-[0-9|X]$";  
	  
    if (!code.matches(regex)) {  
        return false;  
    }  
  */  
	
	public static final boolean pdy1(String ss){
		int sum = 0;  
        for (int i = 0; i < 8; i++) {  
            sum += str.indexOf(String.valueOf(ss.charAt(i)))*ws[i] ;  
        }
        return false;
	}
	
	public static final boolean pdy2(String ss){
		int sum = 0;  
        for (int i = 0; i < 8; i++) {  
            sum += (int)IDX.get(ss.charAt(i))*ws[i] ;  
        }
        return false;
	}
	
	public static int pdy3(String orgid){
		int sum = 0;  
        for (int i = 0; i < 8; i++) {  
            sum += chars[orgid.charAt(i)]*ws[i] ;  
        }
        return 11 - (sum%11);
	}
}

/*
function isValidEntpCode(code, has) {  
    var ws = [3, 7, 9, 10, 5, 8, 4, 2];  
    var str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';  
    var reg = /^([0-9A-Z]){8}$/;   
    if (!reg.test(C1_8)) {  
        return false;  
    }  
    var sum = 0;  
    for (var i = 0; i < 8; i++) {  
        sum += str.indexOf(C1_8.charAt(i)) * ws[i];  
    }  
    var C9 = 11 - (sum % 11);  
    if (C9 == 11) {  
        return '0';  
    } else if (C9 == 10) {  
        return 'X'  
    } else {  
        return C9  
    }  
}  */