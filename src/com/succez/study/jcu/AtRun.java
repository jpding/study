package com.succez.study.jcu;

import java.io.FileInputStream;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import org.apache.commons.io.IOUtils;

import com.succez.commons.util.StringUtils;


public class AtRun {

	private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

	public void beepForAnHour() {
		final Runnable beeper = new Runnable() {
			public void run() {
				System.out.println("beep");
			}
		};
		
		
//		final ScheduledFuture<?> beeperHandle = scheduler.scheduleAtFixedRate(beeper, 10, 10, TimeUnit.SECONDS);
		
		//final ScheduledFuture<?> beeperHandle = scheduler.scheduleAtFixedRate(beeper, 10, 10, TimeUnit.SECONDS);
		final ScheduledFuture<?> beeperHandle = scheduler.scheduleWithFixedDelay(beeper, 10, 10, TimeUnit.SECONDS);
		
		scheduler.scheduleAtFixedRate(new Runnable() {
			public void run() {
				try{
					FileInputStream in = new FileInputStream("d:\\1.txt");
					try{
						String ss = IOUtils.toString(in, "utf-8");
						if(StringUtils.equalsIgnoreCase(ss, "true")){
							beeperHandle.cancel(true);
							scheduler.shutdownNow();
						}
						System.out.println("==1");
					}finally{
						in.close();
					}
				}catch(Exception ex){
					ex.printStackTrace();
				}
			}
		}, 10, 10, TimeUnit.SECONDS);
	}

	public static void main(String [] args){
		(new AtRun()).beepForAnHour();
	}
}
