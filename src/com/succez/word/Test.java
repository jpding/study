package com.succez.word;

import java.util.List;

import com.hankcs.hanlp.HanLP;
import com.hankcs.hanlp.seg.Segment;
import com.hankcs.hanlp.seg.common.Term;

public class Test {

	public static void main(String[] args) {
//		System.out.println(HanLP.segment("硚口区汉正街中心商城住宅B栋25层4室"));
//		System.out.println(HanLP.segment("硚口区长丰街长丰村38栋1层商网"));
		String[] testCase = new String[]{
		        "硚口区解放大道44号",
		        "硚口区宝丰一村13-17号",
		        "硚口区长丰乡天顺园小区第6栋4-3-1号"
		};
		Segment segment = HanLP.newSegment().enablePlaceRecognize(true);
		for (String sentence : testCase)
		{
		    List<Term> termList = segment.seg(sentence);
		    System.out.println(termList);
		}
		
	}

}
