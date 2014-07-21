package com.succez.study.algor;

public class Bubble {

	public static void sort(int [] arr, int len){
		int idx = 0;
		int key = arr[idx];
		boolean b = true;
		for (int i = 1; i < len; i++) {
			if(key > arr[i]){
				int temp = arr[i];
				arr[i] = key;
				arr[idx] = temp;
				b = false;
			}
			key = arr[++idx];
		}
		
		if(b){
			return ;
		}
		
		sort(arr, len-1);
	}
	
	public static void  sort1(int [] arr){
		for (int i = arr.length-1; i >=0; i--) {
			boolean b = true;
			for (int j = 0; j < i; j++) {
				if(arr[j]>arr[j+1]){
					int temp = arr[j];
					arr[j] = arr[j+1];
					arr[j+1] = temp;
					b = false;
				}
			}
			
			if(b){
				break;
			}
		}
	}
}
