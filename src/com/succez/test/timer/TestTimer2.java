package com.succez.test.timer;

import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class TestTimer2 {
	public static int i = 1;
	
	public static void main(String [] args){
		ScheduledThreadPoolExecutor exec = new ScheduledThreadPoolExecutor(5);
		exec.scheduleAtFixedRate(new Tes(), 5, 2, TimeUnit.SECONDS);
	}	
}

class Tes implements Runnable {
	int i=0;
	
	Tes(){
		
	}
	
	@Override
	public void run() {
		System.out.println(i++);
	}
	
}