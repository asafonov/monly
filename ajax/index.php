<?php

if (!isset($_GET['id']) || !isset($_POST['password'])) {
    die();
}

file_exists('../data/') || mkdir('../data');
$filename = '../data/' . md5($_GET['id']);

if (isset($_GET['get'])) {
    if (!file_exists($filename . '.pswd')) {
        file_put_contents($filename . '.pswd', md5($_POST['password']));
    }
    if (!file_exists('../data/' . md5($_GET['id']) . '.json')) die();
    if (file_get_contents($filename . '.pswd') == md5($_POST['password'])) {
        echo file_get_contents('../data/' . md5($_GET['id']) . '.json');
    }
} else {
    if (!file_exists($filename . '.pswd')) {
        file_put_contents($filename . '.pswd', md5($_POST['password']));
    }
    if (file_get_contents($filename . '.pswd') == md5($_POST['password'])) {
        file_put_contents('../data/' . md5($_GET['id']) . '.json', $_POST['data']);
    }
}