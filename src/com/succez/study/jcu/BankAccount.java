package com.succez.study.jcu;

import java.util.concurrent.atomic.AtomicInteger;


public class BankAccount {
	private int number;
//	private int  balance;
	private AtomicInteger balance = new AtomicInteger();
	
	public BankAccount(int number, int balance){
		this.number = number;
		this.balance = new AtomicInteger(balance);
	}
	
	public int getBalance(){
		return balance.get();
	}
	
	public /*synchronized*/ void deposit(int amount){
		//balance = balance + amount;
		balance.addAndGet(amount);
	}
	
	public /*synchronized*/ void withdraw(int amount){
//		balance = balance - amount;
		int oldValue = balance.get();
		balance.compareAndSet(oldValue, oldValue-amount);
	}
	
	public static void main(String [] args) throws Exception{
		BankAccount a = new BankAccount(1, 1000);
		Thread t1 = new Thread(new Depositor(a, 100),"depositor");
		Thread t2 = new Thread(new Withdrawer(a, 100), "withdraw");
		t1.start();;
		t2.start();
		t1.join();
		t2.join();
		System.out.println(a.getBalance());
		
	}
	
	static class Depositor implements Runnable {

		private BankAccount account;
		int amount;
		
		public Depositor(BankAccount account, int amount){
			this.account = account;
			this.amount = amount;
		}
		
		public void run() {
			for (int i = 0; i < 100000; i++) {
				account.deposit(amount);
			}
		}
		
	}
	
	static class Withdrawer implements Runnable{
		BankAccount account;
		int amount;
		public Withdrawer(BankAccount account, int amount){
			this.account = account;
			this.amount = amount;
		}
		
		public void run() {
			for (int i = 0; i < 100000; i++) {
				account.withdraw(amount);
			}
		}
	}
}
