import psutil
import time
import os

def display_usage(cpu_usage, mem_usage, bars=50):
    # Calculate the "Load Bar" visuals
    cpu_percent = (cpu_usage / 100.0)
    cpu_bar = '█' * int(cpu_percent * bars) + '-' * (bars - int(cpu_percent * bars))
    
    mem_percent = (mem_usage / 100.0)
    mem_bar = '█' * int(mem_percent * bars) + '-' * (bars - int(mem_percent * bars))

    # Clear terminal screen (Linux command)
    os.system('clear')
    
    print(f"--- HP EliteBook G7 System Monitor ---")
    print(f"CPU Usage: |{cpu_bar}| {cpu_usage:.2f}%")
    print(f"RAM Usage: |{mem_bar}| {mem_usage:.2f}%")
    print(f"\nPress Ctrl+C to stop the monitor.")

def main():
    try:
        while True:
            # Grab system data
            cpu = psutil.cpu_percent(interval=1)
            mem = psutil.virtual_memory().percent
            
            display_usage(cpu, mem)
            time.sleep(0.5)
            
    except KeyboardInterrupt:
        print("\nMonitoring stopped by user.")

if __name__ == "__main__":
    main()