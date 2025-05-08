import os
import sys
import cv2
import numpy as np
import logging

def setup_opencv():
    logging.info("Setting up OpenCV environment...")
    try:
        # Print OpenCV version for debugging
        logging.info(f"OpenCV version: {cv2.__version__}")
        
        # Check if GUI features are available (they won't be on Heroku)
        has_gui = cv2.getBuildInformation().find('GTK') != -1
        logging.info(f"OpenCV GUI support: {has_gui}")
        
        # Force OpenCV to use headless mode
        os.environ['OPENCV_VIDEOIO_PRIORITY_MSMF'] = '0'
        os.environ['OPENCV_VIDEOIO_DEBUG'] = '0'
        
        # Test basic OpenCV functionality
        test_img = np.zeros((10, 10), dtype=np.uint8)
        test_result = cv2.GaussianBlur(test_img, (3, 3), 0)
        
        logging.info("OpenCV setup completed successfully")
        return True
    except Exception as e:
        logging.error(f"OpenCV setup failed: {e}")
        return False
