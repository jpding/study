package com.succez.study.jcu;

public class SeqNumber {
	private static ThreadLocal<Integer> seqNum = new ThreadLocal<Integer>() {
		protected Integer initialValue() {
			return 0;
		}

	};

	public int getNextNum() {
		seqNum.set(seqNum.get() + 1);
		return seqNum.get();
	}

	private static class TestClient extends Thread {
		private SeqNumber sn;

		public TestClient(SeqNumber sn) {
			this.sn = sn;
		}

		public void run() {
			for (int i = 0; i < 3; i++) {
				System.out.println("thread[" + Thread.currentThread().getName() + "] sn[" + sn.getNextNum() + "]");
			}
		}
	}
	
	public static void main(String [] args){
		SeqNumber sn = new SeqNumber();
		TestClient t1 = new TestClient(sn);
		TestClient t2 = new TestClient(sn);
		TestClient t3 = new TestClient(sn);
		t1.start();
		t2.start();
		t3.start();
	}
}
