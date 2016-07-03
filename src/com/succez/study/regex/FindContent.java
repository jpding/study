package com.succez.study.regex;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FindContent {
	public static void main(String [] args){
		String ss = "中国人民解放军，adsfasdf测试啊";
		Pattern test = Pattern.compile("测试");
		Matcher m = test.matcher(ss);
		System.out.println(m.find());
		System.out.println(m.groupCount());
		System.out.println(m.group());
	}
}
