package com.succez.study.exp;

import java.util.HashMap;
import java.util.Map;

import com.succez.commons.exp.ExpEngine;
import com.succez.commons.exp.ExpVar;
import com.succez.commons.exp.Expression;
import com.succez.commons.exp.impl.DefaultExpContext;
import com.succez.commons.exp.impl.ExpVarObject;
import com.succez.commons.exp.util.ExpReturnTypes;

public class TestCalcExp {
	private final String EXPZZ = "(a+b*2)*5/d";
	
	public static void main(String [] args){
		Map<String, Double> params = new HashMap<String, Double>();
		params.put("A", 1.0);
		params.put("B", 2.0);
		params.put("D", 3.0);
		
		TestCalcExp exp = new TestCalcExp();
		exp.calc(params);
	}
	
	
	public Expression compileExp(String expZz, Map<String , Double> params){
		Expression exp = ExpEngine.createExpression(EXPZZ);
		DefaultExpContext context = new NHLExpContext(params);
		exp.compile(context);
		return exp;
	}
	
	public void calc(Map <String, Double> params){
		Expression exp = compileExp(EXPZZ, params);
//		System.out.println(exp.evaluateDouble(context));
	}
	
	public void visitor(){
//		Expression exp = compileExp(EXPZZ, params);
		
	}
	
	public void refactor(){
		
	}
}

class NHLExpContext extends DefaultExpContext{
	private Map<String, Double> params;
	
	public NHLExpContext(Map<String, Double> params){
		this.params = params;
	}
	
	@Override
	public ExpVar getVar(String name) {
		Double d = params.get(name);
		if(d != null){
			return new ExpVarObject(name, ExpReturnTypes.FLOAT_TYPE, d);
		}
		return super.getVar(name);
	}
}
