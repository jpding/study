package com.succez.test.timer;

import java.util.Timer;
import java.util.TimerTask;

public class TestTimer {
	public static void main(String [] args){
		Timer timer = new Timer("test");
		timer.schedule(new TestTimerTask(), 5*1000, 2*1000);
	}
}

class TestTimerTask extends TimerTask {

	@Override
	public void run() {
		System.out.println(System.currentTimeMillis());
	}
	
}