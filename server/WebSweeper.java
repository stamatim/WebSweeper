import java.util.Random;
import java.util.Scanner;

public class WebSweeper {

	public static int rows;
	public static int cols;
	public static int mines;
	
	public static void main(String[] args) {
		
		int temp;
		
		Scanner in = new Scanner(System.in);
		
		do {
		System.out.println("Enter positive number of rows: ");
		temp = in.nextInt();
		}while(!(temp > 0));
		setRows(temp);
		
		do {
		System.out.println("Enter positive number of columns: ");
		temp = in.nextInt();
		}while(!(temp > 0));
		setCols(temp);
		
		do {
		System.out.println("Enter positive number of mines and less then rows * columns: ");
		temp = in.nextInt();
		}while(!(temp < rows*cols) && !(temp > 0));
		setMines(temp);
		
		
		int[][] field = new int[rows][cols];
		
		field = createField();
		
		printField(field);
		
		int row, col, num;
		
		while(true) {
			System.out.println("\nEnter row col to check adjacent mines, enter -1 to exit: ");
			row = in.nextInt();
			
			if(row == -1)
				break;
			
			col = in.nextInt();
			
			num = checkAdjacent(row, col, field);
			
			System.out.println("Number of adjacent mines is, -1 if mine: " + num);
		}
		
		in.close();
		
	}
	
	public static void setRows(int num) {
		
		rows = num;
		
	}
	
	public static void setCols(int num) {
		
		cols = num;
		
	}
	
	public static void setMines(int num) {
		
		mines = num;
		
	}
	
	public static int[][] createField() {
		
		int[] mineSpot = new int[mines];
		int[][] field = new int[rows][cols];
		int i, j;
		
		mineSpot = genMines();
		
		for(i = 0; i < rows; i++) {
			for(j = 0; j <cols; j++) {
				field[i][j] = 0;
			}
		}
		
		for(i = 0; i < mines; i ++) {
			
			int row = (mineSpot[i] / cols);
			int col = (mineSpot[i] % cols);
			field[row][col] = 1;
		}
		
		return field;
		
	}
	
	private static int[] genMines() {
		
		int[] mineSpot = new int[mines]; 
		int i, j, temp;
		
		for(i = 0; i < mines; i++) {
			mineSpot[i] = -1;
		}
		
		Random rand = new Random();
		
		for(i = 0; i < mines; i++) {
			
			temp = rand.nextInt(rows*cols);
			
			for(j = i; j >= 0; j--) {
				if(temp == mineSpot[j]) {
					temp = -2;
					break;
				}
			}
			
			if(temp == -2) {
				i--;
				continue;
			}
			
			mineSpot[i] = temp;
			
		}
		
		return mineSpot;
	}
	
	public static int checkAdjacent(int row, int col, int[][] field) {
		
		int num = 0;
		
		if(field[row][col] == 1)
			return -1;
		
		if(row - 1 >= 0)
			num += field[row -1][col];
		if(row - 1 >= 0 && col + 1 < cols)
			num += field[row -1][col +1];
		if(col +1 < cols)
			num += field[row][col +1];
		if(col +1 < cols && row +1 < rows)
			num += field[row +1][col +1];
		if(row +1 < rows)
			num += field[row +1][col];
		if(row +1 < rows && col -1 >= 0)
			num += field[row +1][col -1];
		if(col - 1 >= 0)
			num += field[row][col -1];
		if(col -1 >= 0 && row -1 >= 0)
			num += field[row -1][col -1];
		
		return num;
	}
	
	public static void printField(int[][] field) {
		
		int i, j;
		for(i = 0; i < rows; i++) {
			for(j = 0; j < cols; j ++) {
				System.out.print("" + field[i][j] + " ");
			}
			System.out.print("\n");
		}		
	}
}
