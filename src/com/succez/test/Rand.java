package com.succez.test;

import java.util.Random;

public class Rand {

	public static void main(String[] args) {
		Random rnd = new Random();
		int in = rnd.nextInt(9);
		System.out.println(in);
	}

}
