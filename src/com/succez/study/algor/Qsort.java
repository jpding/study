package com.succez.study.algor;

import java.util.Arrays;

import org.apache.commons.lang.ArrayUtils;

public class Qsort {
	
	public static void sort1(int [] arr, int low, int high){
		int idx = sort(arr, low, high);
		if(idx-1>low){
			sort1(arr,low,idx-1);
		}
		
		if(idx+1<high){
			sort1(arr,idx+1,high);
		}
	}
	
	private static int sort(int [] arr, int low, int high){
		int key = arr[low];
		while(low<high){
			while(high>low && arr[high]>key){
				high--;
			}
			
			arr[low++] = arr[high];
			
			while(low<high && arr[low]<key){
				low++;
			}
			arr[high--] = arr[low];
		}
		arr[low]=key;
		return low;
	}
	
	private static void sort2(int [] arr, int low, int high){
		if(low < high){
			int ilow = low;
			int ihigh = high;
			int key = arr[low];
			while(low<high){
				while(high>low && arr[high]>key){
					high--;
				}
				
				arr[low++] = arr[high];
				
				while(low<high && arr[low]<key){
					low++;
				}
				arr[high--] = arr[low];
			}
			arr[low]=key;
			
			sort2(arr, ilow, low-1);
			sort2(arr, low+1, ihigh);
		}
	}
	
	public static void main(String [] args){
		int [] arr = {35,5,8,9,23,56,34,25,67};
		int [] arr1 = arr.clone();
		System.out.println(ArrayUtils.toString(arr));
		long l = System.currentTimeMillis();
		for (int i = 0; i < 500000; i++) {
			int [] arr2 = arr.clone();
			sort1(arr2, 0, arr.length - 1);
		}
		long e =  System.currentTimeMillis();
		
		System.out.println((e-l));
		
		//sort1(arr, 0, arr.length - 1);
		System.out.println(ArrayUtils.toString(arr));
		
		System.out.println(ArrayUtils.toString(arr1));
		//sort2(arr1, 0, arr.length - 1);
		System.out.println(ArrayUtils.toString(arr1));
		
		l = System.currentTimeMillis();
		for (int i = 0; i < 5000000; i++) {
			int [] arr2 = arr.clone();
			sort2(arr2, 0, arr.length - 1);
		}
		e =  System.currentTimeMillis();
		
		System.out.println((e-l));
		
		l = System.currentTimeMillis();
		for (int i = 0; i < 5000000; i++) {
			arr1 = arr.clone();
			Bubble.sort1(arr1);
		}
		e =  System.currentTimeMillis();
		System.out.println((e-l));
		
		l = System.currentTimeMillis();
		for (int i = 0; i < 5000000; i++) {
			arr1 = arr.clone();
			Arrays.sort(arr1);
		}
		e =  System.currentTimeMillis();
		System.out.println((e-l));
		
		
		arr1 = arr.clone();
		Bubble.sort1(arr1);
		System.out.println(ArrayUtils.toString(arr1));
	}
}
