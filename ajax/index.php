<?php

if (!isset($_GET['id'])) {
    die();
}

file_exists('../data/') || mkdir('../data');

if (isset($_POST['data'])) {
    file_put_contents('../data/' . md5($_GET['id']) . '.json', $_POST['data']);
} else {
    if (!file_exists('../data/' . md5($_GET['id']) . '.json')) die();
    echo file_get_contents('../data/' . md5($_GET['id']) . '.json');
}